import { Vector } from '../engine/math/vector';
import Imovable from './IMovable';

type Asteroid = Imovable & {
    angle: number;
    life: number;
    sides: number;
    angleVel: number;
}

export default Asteroid;