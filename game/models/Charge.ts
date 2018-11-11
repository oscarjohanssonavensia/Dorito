import { Vector } from '../engine/math/vector';
import Imovable from './IMovable';

type Charge = Imovable & {
    timer: number;
}

export default Charge;