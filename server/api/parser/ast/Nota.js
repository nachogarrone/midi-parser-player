'use strict';
//var Midi = require('jsmidgen');
class Nota {

  constructor(notas, octava, valor) {
    this.notas = notas;
    this.octava = octava;
    this.valor = valor;
  }

  unparse() {
    var figura = "";
    switch (this.valor) {
      case "w":
        figura = " Redonda";
        break;
      case "h":
        figura = " Blanca";
        break;
      case "q":
        figura = " Negra";
        break;
      case "8":
        figura = " Corchea";
        break;
      case "16":
        figura = " Semi-corchea";
        break;
      case "32":
        figura = " Fusa";
        break;
      case "64":
        figura = " Semi-fusa";
        break;
    }
    return figura;
  }

  semanticCheck(state) {
    // TODO Auto-generated method stub
    return null;
  }

  compileMIDI(state, track) {
    try {
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

      var tiempoNegraSegundo = state.variablesPartitura.get("bpm") / 60;
      var startick = 0.0;
      this.notas.forEach(function (nodoNota) {
        var valorFigura = 0.0;
        if (nodoNota.nombreNota.equals(NotaEnum.LA)) {
          valorFigura = 0.0;
        } else if (nodoNota.nombreNota.equals(NotaEnum.SI)) {
          valorFigura = 2.0;
        } else if (nodoNota.nombreNota.equals(NotaEnum.DO)) {
          valorFigura = 4.0;
        } else if (nodoNota.nombreNota.equals(NotaEnum.RE)) {
          valorFigura = 6.0;
        } else if (nodoNota.nombreNota.equals(NotaEnum.MI)) {
          valorFigura = 8.0;
        } else if (nodoNota.nombreNota.equals(NotaEnum.FA)) {
          valorFigura = 10.0;
        } else if (nodoNota.nombreNota.equals(NotaEnum.SOL)) {
          valorFigura = 12.0;
        }
        var valorAlteracion = 0.0;
        if (nodoNota.alteracion != null) {
          if (nodoNota.alteracion.equals(AlteracionEnum.SOSTENIDO)) {
            valorAlteracion = 1.0;
          } else if (nodoNota.alteracion.equals(AlteracionEnum.DOBLE_SOSTENIDO)) {
            valorAlteracion = 2.0;
          } else if (nodoNota.alteracion.equals(AlteracionEnum.BEMOL)) {
            valorAlteracion = -1.0;
          } else if (nodoNota.alteracion.equals(AlteracionEnum.DOBLE_BEMOL)) {
            valorAlteracion = -2.0;
          } else if (nodoNota.alteracion.equals(AlteracionEnum.BECUADRO)) {
            valorAlteracion = 0.0;
          }

        }
        var tickLength = tiempoNegraSegundo * valorNota;
        var data1 = valorFigura + valorAlteracion + 12 * octava;
        //this.addNote(track, startick, tickLength, data1);
        track.addNote(0, 'c4', 64);
      });

      return state;
    } catch (err) {
      console.log(err.message);
    }

  }

  toString() {
    return "Nota [notas=" + this.notas.toString() + ", octava=" + this.octava + ", valor=" + this.valor + "]";
  }

  addNote(track, startTick, tickLength, key) {
    try {
      track.addNoteOn(0, key, 64);
      track.noteOff(0, key, 64);
      //track.add(new MidiEvent(on, startTick));
      //track.add(new MidiEvent(off, startTick + tickLength));
    } catch (err) {
      console.log(err.message);
    }
  }

}

module.exports = Nota;
