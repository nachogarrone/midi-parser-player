/**
 * Created by Emanuel Chalela on 7/11/2016.
 */
/**
 * Representación de las secuencias de sentencias.
 */
class Compas {
    var
    statements = new Array();

    constructor(statements) {
//        super();
        this.statements = statements;
    }

    function

    unparse() {
        var result = "{ ";
        this.statements.forEach(function (item) {
            result += item.unparse() + " ";
        });
        return result + "}";
    }

    function

    compileMIDI(state, track) {
        statements.forEach(function () {
            this.compileMIDI(state, track);
        });
        state.variablesState.clear();
        return state;
    }

    function

    semanticCheck(state) {
        var sumavalorSimbolosCompas = 0;
        var aux = null;
        this.statements.forEach(function () {
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

    function

    toString() {
        return "Compas [statements=" + this.statements.toString() + "]";
    }

    function

    hashCode() {
        var prime = 31;
        var result = 1;
        result = prime * result + this.statements.hashCode();
        return result;
    }

    function

    arrayEquals(array) {
        if (!array)
            return false;

        if (this.length != array.length)
            return false;

        for (var i = 0, l = this.length; i < l; i++) {
            if (this[i] instanceof Array && array[i] instanceof Array) {
                if (!this[i].equals(array[i]))
                    return false;
            }
            else if (this[i] != array[i]) {
                return false;
            }
        }
        return true;
    }

    function

    equals(obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (typeof (this) != typeof (obj))
            return false;
        var other = obj;
        if (other instanceof Compas) {
            if (!statements.equals(other.statements))
                return false;
            return true;
        } else {
            return false;
        }

    }
}