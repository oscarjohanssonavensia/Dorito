import { EngineContext } from "../Game";
import { forces, explosion } from '../Create';
import { WORM_HOLE_OUT_X, WORM_HOLE_OUT_Y, WORM_HOLE_IN_X, WORM_HOLE_IN_Y, WHITE_HOLE_X, WHITE_HOLE_Y, FORCE_FIELD_RESOLUTION } from '../Consts';
import { Particle } from '../../models/Particle';
import { Vector } from "../math/vector";
import { CustomParticle } from "../../models/CustomParticle";
import { getGuid } from '../math/Collision';

export default (ctx: EngineContext) => {
    const { game, WW, WH, SH, SW, step } = ctx;

    const forceField = game.forceField;

    const width = WW * FORCE_FIELD_RESOLUTION;
    const height = WH * FORCE_FIELD_RESOLUTION;


    forces(forceField, WW * WORM_HOLE_OUT_X, WH * WORM_HOLE_OUT_Y, 4, true);
    forces(forceField, WW * WORM_HOLE_IN_X, WH * WORM_HOLE_IN_Y, 8, false);


    for (let i = 0; i < 1; i++) {
        const p: CustomParticle = {
            guid: getGuid(),
            markNewForColliders: true,
            life: Math.random() * 160,
            radius: 1,
            pos: new Vector(WW * WORM_HOLE_IN_X + (Math.random() - 0.5) * (WW * 0.01 * 8), WH * WORM_HOLE_IN_Y + (Math.random() - 0.5) * (WW * 0.01 * 8)),
            vel: new Vector((Math.random() - 0.5), (Math.random() - 0.5)),
            color: { r: 255, g: 255, b: 255, a: 255 },
        }

        game.customParticles.push(p);
    }

    forces(forceField, WW * WHITE_HOLE_X, WH * WHITE_HOLE_Y, 4, false);



    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let node = forceField[y][x];
            node.mult(0.3);

            //node.setLength(150);
            //node.setAngle(5);
        }
    }



}