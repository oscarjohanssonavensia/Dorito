import { Particle } from "./Particle";
import { Vector } from '../engine/math/vector';
import Imovable from './IMovable';
import Charge from "./Charge";


export type ProximityVectors = {
    from: Vector,
    to: Vector,
}

export type Ship = Imovable & {
    shields: number;

    angle: number;
    life: number;
    bullets: Particle[];
    thrustParticles: Particle[];
    maxBullets: number;
    maxVel: number;
    score: number;
    thrust: Vector;
    damageTaken: boolean;
    layout: Vector[];
    rotatedLayout: Vector[];
    rotatedLayoutPositioned: Vector[];

    enemyDetection: ProximityVectors[];
    asterodDetection: ProximityVectors[];
    anomalyDetection: ProximityVectors[];

    //optional
    charge?: Charge;
    chargeTimer: number;

    electroBastardRay?: Imovable;
}