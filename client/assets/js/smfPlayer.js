/**
 *  Copyright (c) 2010, Matt Westcott & Ben Firshman
 *  Copyright (c) 2014 Ryoya KAWAI
 *
 *  See LICENSE for more information.
 *
 * forked from https://github.com/gasman/jasmid
 *
 **/

class SmfPlayer {
  constructor(output) {
    this.mOut=output;
    this.nsx1Mode=false;
    this.rsrv=[];
  }

  init(midiFile, latency, eventNo) {
    this.midiFile=midiFile;
    this.latency=latency;

    this.trackStates = [];
    this.beatsPerMinute = 120;
    this.ticksPerBeat = this.midiFile.header.ticksPerBeat;
    this.channelCount = 16;
    this.timerId=0;
    this.deltaTiming=0;
    this.nextEventInfo;
    this.samplesToNextEvent = 0;
    this.finished=false;
    this.nowPlaying=false;

    this.eventTime=0;
    this.startTime=0;
    this.interval=0;

    this.forwading=false;
    this.duration=0;
    this._handlingEvents=false;
    this.eventNo=eventNo;
    this.posMoving=false;


    this.getFirstEvent();
  }

  getFirstEvent() {
    this.eventNo=0;
    for (let i = 0; i < this.midiFile.tracks.length; i++) {
      this.trackStates[i] = {
        'nextEventIndex': 0,
        'ticksToNextEvent': (
          this.midiFile.tracks[i].length ?
            this.midiFile.tracks[i][0].deltaTime :
            null
        )
      };
    }
    this._getNextEvent();
  }

  moveEvent(type) {
    const playing=this.nowPlaying;
    switch(type) {
      case "eventNo":
        break;
      case "forward":
        this.allSoundOff();
        this.stopPlayOnly();
        for(let i=0; i<100; i++) {
          this._getNextEvent();
        }
        break;
      case "backward":
        this.allSoundOff();
        const targetEventNo=this.eventNo;
        this.stopPlayOnly();
        this.getFirstEvent();
        while(this.eventNo<targetEventNo-100) {
          this._getNextEvent();
        }
        break;
      case "zero":
        this.allSoundOff();
        this.stopPlayOnly();
        this.getFirstEvent();
        if(this.nowPlaying==true) {
          this.changeFinished(false);
          this.startPlay();
        }
        break;
    }
    if(playing==true) {
      this.changeFinished(false);
      this.startPlay();
    }
  }

  _getNextEvent() {
    this.eventNo++;
    let ticksToNextEvent = null;
    let nextEventTrack = null;
    let nextEventIndex = null;
    for (var i = 0; i < this.trackStates.length; i++) {
      if ( this.trackStates[i].ticksToNextEvent != null
        && (ticksToNextEvent == null || this.trackStates[i].ticksToNextEvent < ticksToNextEvent)
      ) {
        ticksToNextEvent = this.trackStates[i].ticksToNextEvent;
        nextEventTrack = i;
        nextEventIndex = this.trackStates[i].nextEventIndex;
      }
    }

    if (nextEventTrack != null) {
      // consume event from that track
      const nextEvent = this.midiFile.tracks[nextEventTrack][nextEventIndex];
      if (this.midiFile.tracks[nextEventTrack][nextEventIndex + 1]) {
        this.trackStates[nextEventTrack].ticksToNextEvent += this.midiFile.tracks[nextEventTrack][nextEventIndex + 1].deltaTime;
      } else {
        this.trackStates[nextEventTrack].ticksToNextEvent = null;
      }
      this.trackStates[nextEventTrack].nextEventIndex += 1;
      // advance timings on all tracks by ticksToNextEvent
      for (var i = 0; i < this.trackStates.length; i++) {
        if (this.trackStates[i].ticksToNextEvent != null) {
          this.trackStates[i].ticksToNextEvent -= ticksToNextEvent;
        }
      }
      this.nextEventInfo = {
        'ticksToEvent': ticksToNextEvent,
        'event': nextEvent,
        'track': nextEventTrack
      };
      const beatsToNextEvent = ticksToNextEvent / this.ticksPerBeat;
      const secondsToNextEvent = beatsToNextEvent / (this.beatsPerMinute / 60);
    } else {
      this.nextEventInfo=null;
      this.samplesToNextEvent=null;
      this.finished=true;
    }
  }

  _handleEvent() {
    // add absolite timestamp, and send msaage a little bit faster
    const rightNow=window.performance.now();
    if((this.startTime+this.eventTime)<=rightNow) { // latency
      if(this.finished==true)  {
        this.allSoundOff();
        return;
      }
      const event = this.nextEventInfo.event;
      this.deltaTiming=this.nextEventInfo.ticksToEvent;
      this.eventTime+=this.deltaTiming*this.interval;

      switch(event.type) {
        case "meta":
          if(event.subtype=="setTempo") {
            console.info("[Change Tempo] ", ~~(60000000/event.microsecondsPerBeat));
            console.info("[Change Interval] ", (event.microsecondsPerBeat/1000)/this.ticksPerBeat, event.microsecondsPerBeat);
            this.interval = (event.microsecondsPerBeat/1000)/this.ticksPerBeat;
            clearTimeout(this.timerId);
            if(this.finished==false) {
              this.startPlay();
            }
          } else {
            console.info(`[meta] ${event.subtype} : ${event.text} : ${event.key} : ${event.scale} : ${this.eventTime}`);
          }
          break;
        case "channel":
        case "sysEx":
        case "dividedSysEx":
          let sendFl=true;
          if(event.type=="sysEx") {
            const gsSysEx=[0xF0, 0x41, 0x10, 0x42, 0x12];
            if(event.raw.slice(0, gsSysEx.length).join(" ")==gsSysEx.join(" ")) {
              sendFl=false;
              for(var i=0, out=[], msg=event.raw; i<msg.length; i++) out.push(msg[i].toString(16));
              console.info("[Skip GS SYSEX] ", out.join(" "));
            }
          }

          // for dividedSysEx
          if(event.type=="sysEx") {
            if(event.raw[0]==0xf0 && event.raw[event.raw.length-1]!=0xf7) {
              this.rsrv=event.raw;
              sendFl=false;
            }
          }
          if(event.type=="dividedSysEx") {
            event.raw.shift();
            console.log(event.raw, this.rsrv);
            Array.prototype.push.apply(this.rsrv, event.raw);
            if(this.rsrv[this.rsrv.length-1]==0xf7) {
              event.raw=this.rsrv;
              this.rsrv=[];
            } else {
              sendFl=false;
            }
          }


          /*
           // disp send midi message
           var out=[];
           var msg=event.raw;
           for(var i=0; i<msg.length; i++) {
           out.push(("00"+msg[i].toString(16)).slice(-2));
           }
           console.log(this.eventTime, sendFl, out.join(" "));
           */

          if(sendFl===true) this._sendToDevice(event.raw, this.startTime+this.eventTime);
          break;
      }
      this._getNextEvent();

      if(this.nextEventInfo!=null) {
        const nEvent = this.nextEventInfo.event;
        // Recursion
        if(nEvent.deltaTime==0 && this.finished===false) {
          clearInterval(this.timerId);
          this._handleEvent();
        }
        if(this.finished==false) {
          this.startPlay();
        }
      }
    }
  }

  _sendToDevice(msg, time) {
    if(this.posMoving==true) {
      return;
    }

    this.dispEventMonitor(msg, null, this.latency);

    const sb1=msg[0].toString(16).substr(0,1);
    const sb2=msg[0].toString(16).substr(1,1);
    const ch=parseInt(sb2, 16);
    if(ch<16 && (sb1==8 || sb1==9)) {
      if(chInfo[ch].on==false) {
        return;
      }
    }
    this.mOut.send(msg, time+this.latency);
  }

  startPlay() {
    clearInterval(this.timerId);
    if(this.startTime==0) {
      this.setStartTime();
      this.setGM();
    }
    if(this.finished==false) {
      const self=this;
      this.nowPlaying=true;
      this.timerId=setInterval( () => {
        self._handleEvent.bind(self)();
        if(self.finished==true) {
          clearInterval(self.timerId);
          self.stopPlay.bind(self)();
        }
      }, this.interval );
    }
  }

  stopPlayOnly() {
    this.nowPlaying=false;
    clearInterval(this.timerId);
    this.allSoundOff();
  }

  stopPlay() {
    this.stopPlayOnly();
    //console.log("[Stoped SMF]");
    this.changeUiStop();
  }

  changeUiStop() {
  }

  dispEventMonitor(msg, type, latency) {
  }

  changeFinished(status) {
    this.finished=status;
    clearInterval(this.timerId);
  }

  setStartTime() {
    this.startTime=window.performance.now();
    this.eventTime=0;
    console.log("[setStartTime]", this.startTime);
  }

  allSoundOff() {
    for(let i=0; i<16; i++) {
      const fb=`0xb${i.toString(16)}`;
      this._sendToDevice([fb, 0x78, 0x00], this.startTime+this.eventTime);
    }
  }

  revertPitchBend() {
    for(let i=0; i<16; i++) {
      const fb=`0xe${i.toString(16)}`;
      this._sendToDevice([fb, 0x00, 0x00], this.startTime+this.eventTime);
    }
  }

  setGM() {
    console.log("[Set GM]");
    this._sendToDevice([0xf0, 0x7e, 0x7f, 0x09, 0x01, 0xf7], 0); // GM System ON
  }
}
