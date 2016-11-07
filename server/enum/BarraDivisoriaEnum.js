/**
 * Created by Emanuel Chalela on 2/11/2016.
 */
import {enum} from 'enumify';
class BarraDivisoriaEnum extends Enum {

    BarraDivisoriaEnum.initEnum({
    SIMPLE: "|",
    FIN: "||",
    INICIO_REPETICION: "|:",
    FIN_REPETICION:":|"
    });

var div;

constructor(div) {
    this.div = div;
}

function getDiv() {
    return div;
}

function setDiv(div) {
    this.div = div;
}
}