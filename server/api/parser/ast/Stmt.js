'use strict';

/**
 * Created by Emanuel Chalela on 2/11/2016.
 */
class Stmt {

  unparse() {
  }

  semanticCheck(state) {
  }

  compileMIDI(state, fileMidi) {
  }

  toString() {
  }

  hashCode() {
  }

  equals(obj) {
  }

  getRandom(min, max) {
    return Math.random() * (max - min) + min;
  }

  generate(random, min, max) {
    var TERMINAL_COUNT = 1;
    var NONTERMINAL_COUNT = 4;
    var min = 0;
    var max = TERMINAL_COUNT + NONTERMINAL_COUNT;
    var i = getRandom(min, max);
    switch (i) {
      // Terminals

//		case 4:
//			return ListaCompas.generate(random, min - 1, max - 1);
      default:
        throw new Error("Unexpected error at Stmt.generate()!");
    }
  }
}
