import { Particle } from "./Particle";
import { Ship } from './Ship';
import Asteroid from "./Asteroid";
import { Vector } from "../engine/math/vector";
import { CustomParticle } from './CustomParticle';

export type Star = {
    x: number;
    alpha: number;
}

export class GamePool {
    particles: Particle[] = [];
}


export default class Game {
    public particles: Particle[] = [];
    public customParticles: CustomParticle[] = [];
    public starMap: Star[] = [];
    public player: Ship;
    public enemies: Ship[];
    public asteroids: Asteroid[];
    public SX: number = 0;
    public SY: number = 0;
    public forceField: Vector[][] = [[]];
    public performance: {
        engine: number[],
        gui: number[],
        particles: number,
        asteroids: number,
    };
    public testMode: boolean;
    public debug?: any;
}