'use strict';

/**
 * Created by Emanuel Chalela on 2/11/2016.
 */
class State {

  //    var variablesPartitura = {};
  //    var variablesState = {};
  //    var errores = {};

    constructor(variablesPartitura, variablesState, errores) {
        this.variablesPartitura = variablesPartitura;
        this.variablesState = variablesState;
        this.errores = errores;
    }

    toString() {
        return "State [variablesPartitura=" + this.variablesPartitura.toString() + ", variablesState=" + this.variablesState.toString() + "]";
    }
}