'use strict';

/**
 * Created by Emanuel Chalela on 31/10/2016.
 */

class Partitura extends Stmt {


  // var
  // this.compases;
  // var
  // this.time;
  // var
  // this.bpm;

  constructor(compases, time, bpm) {
    super();
    this.compases = compases;
    this.time = time;
    this.bpm = bpm;
  }

  function

  unparse() {
    // TODO Auto-generated method stub
    return null;
  }

  function

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

  function

  compileMIDI(state, fileMidi) {
    var seq = new Sequence(Sequence.PPQ, 4);
    var track = seq.createTrack();
    state.variablesPartitura.put("this.bpm", this.bpm);
    this.compases.forEach(function () {
      compileMIDI(state, track);
    });
    MidiSystem.write(seq, 1, fileMidi);
    return state;
  }

  function

  toString() {
    return "Partitura [this.compases=" + this.compases.toString() + ", this.time=" + this.time + ", this.bpm=" + this.bpm + "]";
  }

  function

  hashCode() {
    // TODO Auto-generated method stub
    return 0;
  }

  function

  equals(obj) {
    // TODO Auto-generated method stub
    return false;
  }

}
