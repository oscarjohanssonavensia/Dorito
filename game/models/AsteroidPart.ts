import { Vector } from '../engine/math/vector';
import Imovable from './IMovable';

type AsteroidPart = Imovable & {
    angle: number;
    life: number;
    angleVel: number;

    edgeA: Vector;
    edgeB: Vector;
    rotatedEdgeA: Vector;
    rotatedEdgeB: Vector;
}

export default AsteroidPart;