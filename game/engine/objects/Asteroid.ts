import { EngineContext } from '../Game';
import { shift as MapedgeShift } from '../math/Mapedge';
import Force from '../math/Force';
import { wormhole } from '../math/Force';

export default (ctx: EngineContext) => {

    const { game, WW, WH } = ctx;

    const asteroids = game.asteroids;

    let len = asteroids.length;
    for (let i = 0; i < len; i++) {
        const asteroid = asteroids[i];



        const velLen = asteroid.vel.getLength();
        if (velLen > 3) {
            asteroid.vel.setLength(3);
        }

        asteroid.pos.add(asteroid.vel);
        asteroid.angle += asteroid.angleVel;

        if (velLen > 0.2) {
            asteroid.vel.mult(0.9999);
        }



        MapedgeShift(asteroid, WW, WH);
        Force(game.forceField, asteroid);
        wormhole(asteroid, WW, WH);
    }
}