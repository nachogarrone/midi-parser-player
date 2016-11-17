'use strict';

/**
 * Created by Emanuel Chalela on 7/11/2016.
 */
/**
 * Representación de las secuencias de sentencias.
 */
class Compas {
  // var
  // statements = new Array();

  constructor(statements) {
    this.statements = statements;
  }

  unparse() {
    var result = "{ ";
    this.statements.forEach(function (item) {
      result += item.unparse() + " ";
    });
    return result + "}";
  }

  compileMIDI(state, track) {
    this.statements.forEach(function () {
      this.compileMIDI(state, track);
    });
    state.variablesState.clear();
    return state;
  }

  semanticCheck(state) {
    var sumavalorSimbolosCompas = 0;
    var aux = null;
    this.statements.forEach(function (simbolo) {
      var valorSimbolo = 0.0;
      if (simbolo instanceof Nota) {
        switch (simbolo.valor) {
          case "w":
            valorSimbolo = 4.0;
          case "h":
            valorSimbolo = 2.0;
          case "q":
            valorSimbolo = 1.0;
          case "8":
            valorSimbolo = 1.0 / 2;
          case "16":
            valorSimbolo = 1.0 / 4;
          case "32":
            valorSimbolo = 1.0 / 8;
          case "64":
            valorSimbolo = 1.0 / 16;
        }
      } else if (simbolo instanceof Silencio) {
        switch (simbolo.valor) {
          case "w":
            valorSimbolo = 4.0;
          case "h":
            valorSimbolo = 2.0;
          case "q":
            valorSimbolo = 1.0;
          case "8":
            valorSimbolo = 1.0 / 2;
          case "16":
            valorSimbolo = 1.0 / 4;
          case "32":
            valorSimbolo = 1.0 / 8;
          case "64":
            valorSimbolo = 1.0 / 16;
        }
      }
      sumavalorSimbolosCompas = +valorSimbolo;
    });
    if (!state.variablesPartitura.get("time").equals(sumavalorSimbolosCompas)) {
      state.errores.add(
        "el valor de las notas de un compas no son equivalentes al time correspondiente de la partitura.");
    }
    return state;
  }

  toString() {
    return "Compas [statements=" + this.statements.toString() + "]";
  }
}

module.exports = Compas;
