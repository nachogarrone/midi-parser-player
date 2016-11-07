/**
 * Created by Emanuel Chalela on 2/11/2016.
 */
import {enum} from 'enumify';
class AleracionEnum extends Enum {

    AlteracionEnum.initEnum({
        SOSTENIDO: "#",
        DOBLE_SOSTENIDO: "##",
        BEMOL: "@",
        DOBLE_BEMOL: "@@",
        BECUADRO: "n"
    });

    var
    alteracion;

    constructor(alteracion) {
        this.alteracion = alteracion;
    }

    function

    getDiv() {
        return alteracion;
    }

    function

    setDiv(div) {
        this.alteracion = div;
    }
}