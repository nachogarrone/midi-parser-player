/**
 * Created by Emanuel Chalela on 2/11/2016.
 */
import {enum} from 'enumify';
class NotaEnum extends Enum {


    //var NotaEnum = { DO: "C", RE: "D", MI: "E", FA: "F", SOL: "G", LA: "A", SI: "B"};

    NotaEnum.initEnum({
        DO: "C",
        RE: "D",
        MI: "E",
        FA: "F",
        SOL: "G",
        LA: "A",
        SI: "B"
    });

    var
    nota;

    constructor(nota) {
        this.nota = nota;
    }

    function

    getNota() {
        return nota;
    }

    function

    setNota(nota) {
        this.nota = nota;
    }

}