import Imovable from '../../models/IMovable';
import { Vector } from './vector';
import { WORM_HOLE_IN_X, WORM_HOLE_IN_Y, WORM_HOLE_OUT_X, WORM_HOLE_OUT_Y } from '../Consts';


export default (forceField: Vector[][], item: Imovable) => {
    var fy = Math.floor(item.pos.y * 0.01);
    var fx = Math.floor(item.pos.x * 0.01);

    const row = forceField[fy];
    if (row) {
        let node = row[fx];
        if (node) {
            const massRelatedNode = new Vector(node.x, node.y);
            massRelatedNode.mult(10 / item.radius);

            item.vel.add(massRelatedNode);
        }
    }
}

export const wormhole = (item: Imovable, WW: number, WH: number) => {

    const x = WW * WORM_HOLE_IN_X;
    const y = WH * WORM_HOLE_IN_Y;

    const safety = WW * 0.0025;

    if (item.pos.x < x + safety && item.pos.x > x - safety && item.pos.y < y + safety && item.pos.y > y - safety) {
        item.vel.setAngle(Math.random() - 0.5)
        item.pos.x = WW * WORM_HOLE_OUT_X + (Math.random() - 0.5) * safety;
        item.pos.y = WH * WORM_HOLE_OUT_Y + (Math.random() - 0.5) * safety;
    }

}