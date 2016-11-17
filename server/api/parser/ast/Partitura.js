'use strict';
var Midi = require('jsmidgen');

class Partitura {
  constructor(compases, time, bpm) {
    // super();
    this.compases = compases;
    this.time = time;
    this.bpm = bpm;
  }

  unparse() {
    // TODO Auto-generated method stub
    return null;
  }

  semanticCheck(state) {
    state.variablesPartitura.put("this.bpm", this.this.bpm);
    var valorCompas = 0.0;
    if (this.time.equals(this.timeEnum.CUATRO_CUARTO) || this.time.equals(this.timeEnum.C)) {
      valorCompas = 4.0;
    } else if (this.time.equals(this.timeEnum.TRES_CUARTO)) {
      valorCompas = 3.0;
    } else if (this.time.equals(this.timeEnum.DOS_CUARTO)) {
      valorCompas = 2.0;
    }
    state.variablesPartitura.put("this.bpm", this.bpm);
    state.variablesPartitura.put("this.time", valorCompas);
    // TODO Auto-generated method stub
    return state;
  }

  compileMIDI(state, fileMidi) {
    try{
        var seq = new Sequence(Sequence.PPQ, 4);
        var track = new Midi.Track();
//        file.addTrack(track);

        state.variablesPartitura.put("this.bpm", this.bpm);
        //this.compases.forEach(function (compas) {
            compas.compileMIDI(state, track);
        //});
      fileMidi.addTrack(track);
        MidiSystem.write(seq, 1, fileMidi);
        return state;
    } catch(err){
      console.log(err.message);
    }
  }

  toString() {
    return "Partitura [this.compases=" + this.compases.toString() + ", this.time=" + this.time + ", this.bpm=" + this.bpm + "]";
  }

  hashCode() {
    // TODO Auto-generated method stub
    return 0;
  }

  equals(obj) {
    // TODO Auto-generated method stub
    return false;
  }

}

module.exports = Partitura;
