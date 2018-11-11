import Imovable from '../../models/IMovable';
import { Vector } from '../math/vector';


const velocity: Vector = new Vector(0, 0);

// TODO: use this everywhere .. 

export default (item: Imovable, step: number) => {
    velocity.set(item.vel.x, item.vel.y);
    velocity.mult(step);
    item.pos.add(velocity);
}