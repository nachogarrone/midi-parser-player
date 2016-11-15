'use strict';

/**
 * Created by Emanuel Chalela on 2/11/2016.
 */

class Silencio extends Simbolo {


  // var
  // valor = null;

  constructor(valor) {
    super();
    this.valor = valor;
  }

  unparse() {
    switch (this.valor) {
      case "w":
        return "Silencio de Redonda";
      case "h":
        return "Silencio de Blanca";
      case "q":
        return "Silencio de Negra";
      case "8":
        return "Silencio de Corchea";
      case "16":
        return "Silencio de Semi-corchea";
      case "32":
        return "Silencio de Fusa";
      case "64":
        return "Silencio de Semi-fusa";
    }
    return null;
  }

  compileMIDI(state, track) {
    var tiempoNegraSegundo = state.variablesPartitura.get("bpm") / 60;
    var startick = 0;
    var valorNota = 0.0;
    switch (this.valor) {
      case "w":
        valorNota = 4.0;
        break;
      case "h":
        valorNota = 2.0;
        break;
      case "q":
        valorNota = 1.0;
        break;
      case "8":
        valorNota = 1.0 / 2;
        break;
      case "16":
        valorNota = 1.0 / 4;
        break;
      case "32":
        valorNota = 1.0 / 8;
        break;
      case "64":
        valorNota = 1.0 / 16;
        break;
    }
    var tickLength = tiempoNegraSegundo * valorNota;
    addSilence(track, startick, tickLength, 60);
    return state;
  }

  semanticCheck(state) {
    return null;
  }

  toString() {
    return "Silencio(" + this.valor + ")";
  }

  hashCode() {
    var result = 1;
    result = result * 31;
    return result;
  }

  equals(obj) {
    if (this == obj) {
      return true;
    }
    return false;
  }

  generate(random, min, max) {
    var figuras = ["w", "h", "q", "8", "16", "32", "64"];
    return new Silencio(figuras[Math.random() * 3]);
  }

  addSilence(track, startTick, tickLength, key) {
    var on = new ShortMessage();
    on.setMessage(ShortMessage.NOTE_ON, 0, key, 0);
    var off = new ShortMessage();
    off.setMessage(ShortMessage.NOTE_OFF, 0, key, 0);
    track.add(new MidiEvent(on, startTick));
    track.add(new MidiEvent(off, startTick + tickLength));
  }

}

module.exports = Silencio;
