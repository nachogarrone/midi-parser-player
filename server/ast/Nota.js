'use strict';

/**
 * Created by Emanuel Chalela on 2/11/2016.
 */
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
      case "h":
        figura = " Blanca";
      case "q":
        figura = " Negra";
      case "8":
        figura = " Corchea";
      case "16":
        figura = " Semi-corchea";
      case "32":
        figura = " Fusa";
      case "64":
        figura = " Semi-fusa";
    }
    return "";
  }

  semanticCheck(state) {
    // TODO Auto-generated method stub
    return null;
  }

  compileMIDI(state, track) {
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
      addNote(track, startick, tickLength, data1);
    });

    return state;
  }

  toString() {
    return "Nota [notas=" + this.notas.toString() + ", octava=" + this.octava + ", valor=" + this.valor + "]";
  }

  hashCode() {
    var prime = 31;
    var result = 1;
    result = prime * result + Arrays.hashCode(this.notas);
    result = prime * result + ((this.octava == null) ? 0 : this.octava.hashCode());
    result = prime * result + ((this.valor == null) ? 0 : this.valor.hashCode());
    return result;
  }

  equals(obj) {
    if (this == obj)
      return true;
    if (obj == null)
      return false;
    if (typeof (this) != typeof (obj))
      return false;
    var other = obj;
    if (other instanceof Nota) {
      if (!this.notas.equals(other.notas))
        return false;
      if (this.octava == null) {
        if (other.octava != null)
          return false;
      } else if (!this.octava.equals(other.octava))
        return false;
      if (this.valor == null) {
        if (other.valor != null)
          return false;
      } else if (!this.valor.equals(other.valor))
        return false;
      return true;
    }
    return false;
  }

  addNote(track, startTick, tickLength, key) {
    var on = new ShortMessage();
    on.setMessage(ShortMessage.NOTE_ON, 0, key, 64);
    var off = new ShortMessage();
    off.setMessage(ShortMessage.NOTE_OFF, 0, key, 64);
    track.add(new MidiEvent(on, startTick));
    track.add(new MidiEvent(off, startTick + tickLength));
  }
}
