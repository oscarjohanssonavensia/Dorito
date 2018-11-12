import { GuiContext } from "../Game";
import { blockCircleRGBA, onStage } from '../Buffer';
import Text from '../text/CreateText';
import Imovable from '../../models/IMovable';
import { EngineContext } from '../../engine/Game';
import { explosion } from '../../engine/Create';
import { Vector } from '../../engine/math/vector';
import Asteroid from '../../models/Asteroid';
import { getGuid } from '../../engine/math/Collision';
import { Ship } from '../../models/Ship';
import Types from '../../models/Types';


export const removeAsteroid = (asteroid: Imovable, ctx: EngineContext, removedByShip?: Ship) => {
    asteroid.remove = true;
    explosion(ctx.game.forceField, 100, asteroid.pos.x, asteroid.pos.y, ctx.game.particles);

    if (asteroid.radius > 5) {
        for (let s = 0; s < 5; s++) {
            const vel = new Vector(Math.random() * 5, Math.random() * 5)
            vel.setLength(Math.random() * 2);
            const smallAsteroid: Asteroid = {
                type: Types.TYPE_ASTEROID,
                guid: getGuid(),
                markNewForColliders: true,
                pos: new Vector(asteroid.pos.x + (Math.random() - 0.5) * asteroid.radius, asteroid.pos.y + (Math.random() - 0.5) * asteroid.radius),
                radius: asteroid.radius * 0.2,
                vel: vel,
                sides: (Math.random() * 2 + 7) >> 0,
                angle: 0,
                angleVel: (1 - Math.random() * 2) * 0.01,
                life: 20,
            };
            ctx.game.asteroids.push(smallAsteroid);
            if (removedByShip) {
                removedByShip.score += 5;
                removedByShip.life += 5;
                if (removedByShip.shields < 1000) {
                    removedByShip.shields += 200;
                }
            }
        }
    } else {
        if (removedByShip) {
            removedByShip.score++;
            removedByShip.life++;
        }

    }
}

export default (guictx: GuiContext) => {
    const { ctx, frame, WW, WH, game, SW, SH, SX, SY } = guictx;

    const asteroids = guictx.game.asteroids;




    for (let i = 0; i < asteroids.length; i++) {
        var a = asteroids[i];
        if (onStage(guictx, a.pos.x, a.pos.y, a.radius)) {
            //const radius = a.life < a.radius ? a.radius + (Math.random() - 0.5) * a.radius * 0.4 : a.radius;
            blockCircleRGBA(a.sides, a.radius, a.pos.x, a.pos.y, a.angle, frame, 255, 255, 255, 255, SW, SH, SX, SY);
            const BUFFER = Text.create(Math.floor(a.life) + '', 20, 'r')
            Text.add(SW, frame, BUFFER, a.pos.x - SX, a.pos.y - SY);
        }
    }
}