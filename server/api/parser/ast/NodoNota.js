'use strict';

/**
 * Created by Emanuel Chalela on 2/11/2016.
 */

class NodoNota {

    //var nombreNota;
    //var alteracion;

    constructor(nombreNota) {
      this.nombre = nombreNota;
      this.alter = "";
    }

    // constructor(nombreNota, alteracion) {
    //     this.nombreNota = nombreNota;
    //     this.alteracion = alteracion;
    // }

    unparse() {
        switch (this.nombre) {
            case "A":
                return "La";
            case "B":
                return "Si";
            case "C":
                return "Do";
            case "D":
                return "Re";
            case "E":
                return "Mi";
            case "F":
                return "Fa";
            case "G":
                return "Sol";
        }
        return null;
    }

    toString() {
        return "NodoNota [nombreNota=" + this.nombre + ", alteracion=" + this.alter + "]";
    }
}

module.exports = NodoNota;
