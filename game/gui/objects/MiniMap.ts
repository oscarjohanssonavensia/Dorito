



import { setRGBA, fillRGBA, line2 } from '../Buffer';
import { GuiContext } from '../Game';
import { Particle } from '../../models/Particle';
import Imovable from '../../models/IMovable';
import { Vector } from '../../engine/math/vector';
import { WORM_HOLE_IN_X, WORM_HOLE_IN_Y, WORM_HOLE_OUT_X, WORM_HOLE_OUT_Y, WHITE_HOLE_X, WHITE_HOLE_Y } from '../../engine/Consts';


export default (guiContext: GuiContext) => {

    const { SW, frame, WW, WH, SX, SY, SH, game } = guiContext;

    let particles: Imovable[] = game.asteroids;
    let len = particles.length;
    let particle;

    const mapW = WW / SW;
    const mapH = WH / SH;
    const offset = 100;
    //box
    /*
        for (let x = 0; x < SW / mapW; x++) {
            setRGBA(SW, x + offset, offset, 155, 155, 155, 255, frame);
            setRGBA(SW, x + offset, offset + SH / mapH, 100, 100, 100, 255, frame);
        }
    */
    const cornerOffset = 10;
    const xOffset = SW / mapW;
    const yOffset = SH / mapH;


    line2(SW, offset + cornerOffset, offset, offset + xOffset - cornerOffset, offset, 100, 100, 100, 255, frame);
    line2(SW, offset + cornerOffset, offset + yOffset, offset + xOffset - cornerOffset, offset + yOffset, 100, 100, 100, 255, frame);

    line2(SW, offset, offset + cornerOffset, offset, offset + yOffset - cornerOffset, 100, 100, 100, 255, frame);
    line2(SW, offset + xOffset, offset + cornerOffset, offset + xOffset, offset + yOffset - cornerOffset, 100, 100, 100, 255, frame);

    line2(SW, offset + cornerOffset, offset, offset, offset + cornerOffset, 100, 100, 100, 255, frame);
    line2(SW, offset + xOffset - cornerOffset, offset, offset + xOffset, offset + cornerOffset, 100, 100, 100, 255, frame);

    line2(SW, offset + xOffset, offset + yOffset - cornerOffset, offset + xOffset - cornerOffset, offset + yOffset, 100, 100, 100, 255, frame);
    line2(SW, offset, offset + yOffset - cornerOffset, offset + cornerOffset, offset + yOffset, 100, 100, 100, 255, frame);




    for (let i = 0; i < len; i++) {
        particle = particles[i];
        if (particle.radius > 100) { //Asteroid radius

            const x = Math.floor(((particle.pos.x) / mapW) * 0.1 + offset);
            const y = Math.floor(((particle.pos.y) / mapH) * 0.1 + offset);

            fillRGBA(SW, x, y, 3, 3, 255, 255, 255, 255, frame, -1, -1);
        }
    }


    particles = game.enemies;
    len = particles.length;

    for (let i = 0; i < len; i++) {
        particle = particles[i];

        const x = Math.floor(((particle.pos.x) / mapW) * 0.1 + offset);
        const y = Math.floor(((particle.pos.y) / mapH) * 0.1 + offset);

        fillRGBA(SW, x, y, 2, 2, 255, 0, 0, 255, frame, -1, -1);
    }





    const ship = guiContext.game.player;
    const x = Math.floor(((ship.pos.x) / mapW) * 0.1 + offset);
    const y = Math.floor(((ship.pos.y) / mapH) * 0.1 + offset);

    fillRGBA(SW, x, y, 4, 4, 255, 255, 0, 255, frame, -2, -2);




    const anomalies = [new Vector(WORM_HOLE_IN_X * WW, WORM_HOLE_IN_Y * WH), new Vector(WORM_HOLE_OUT_X * WW, WORM_HOLE_OUT_Y * WH), new Vector(WHITE_HOLE_X * WW, WHITE_HOLE_Y * WH)];
    len = anomalies.length;

    for (let i = 0; i < len; i++) {
        const anomaly = anomalies[i];

        const x = Math.floor(((anomaly.x) / mapW) * 0.1 + offset);
        const y = Math.floor(((anomaly.y) / mapH) * 0.1 + offset);

        fillRGBA(SW, x, y, 2, 2, 0, 255, 0, 255, frame, -1, -1);
    }
}