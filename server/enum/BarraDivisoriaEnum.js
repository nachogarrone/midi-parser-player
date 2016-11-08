'use strict';

/**
 * Created by Emanuel Chalela on 2/11/2016.
 */
import {enum} from 'enumify';
class BarraDivisoriaEnum extends Enum {
}

BarraDivisoriaEnum.initEnum({
  SIMPLE: "|",
  FIN: "||",
  INICIO_REPETICION: "|:",
  FIN_REPETICION: ":|"
});