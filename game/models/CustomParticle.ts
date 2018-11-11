
import Imovable from './IMovable';
import { Particle } from './Particle';
import { Pixel } from './Pixel';

export type CustomParticle = Particle & {
    color: Pixel;
}