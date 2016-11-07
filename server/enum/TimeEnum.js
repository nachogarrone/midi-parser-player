/**
 * Created by Emanuel Chalela on 2/11/2016.
 */

import {enum} from 'enumify';
class  TimeEnum extends Enum {

    TimeEnum.initEnum({
    DOS_CUARTO: "2/4",
    TRES_CUARTO: "3/4",
    CUATRO_CUATRO: "4/4",
    C : "C"});

    var time;

    constructor(time) {
        this.time = time;
    }

    function getDiv() {
        return time;
    }

    function setDiv(div) {
        this.time = div;
    }

}