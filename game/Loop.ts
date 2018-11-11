import initialization, { start, createAsteroid, SW_init as SW, SH_init as SH, WH_init as WH, WW_init as WW } from "./init/initialization";
import { Vector } from "./engine/math/vector";
import Asteroid from "./models/Asteroid";
import { ASTEROID_RADIUS_LIFE_MULTIP } from "./engine/Consts";
import { createEnemies } from './init/initialization';
import { getGuid } from './engine/math/Collision';

export default class Startup {

    public static main() {

        const game = initialization();

        for (let i = 0; i < 300; i++) {
            const velocity = new Vector((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
            velocity.setLength(1 * Math.random());
            velocity.setAngle((Math.random() - 0.5) * (Math.PI * 2))
            const radius = Math.random() > 0.97 ? 400 : Math.random() * 50 + 50;
            const asteroid: Asteroid = {
                guid: getGuid(),
                markNewForColliders: true,
                pos: new Vector(WW * Math.random(), WH * Math.random()),
                radius,
                vel: velocity,
                sides: (Math.random() * 2 + 7) >> 0,
                angle: 0,
                angleVel: (1 - Math.random() * 2) * 0.01,
                life: radius * ASTEROID_RADIUS_LIFE_MULTIP,
            }
            game.asteroids.push(asteroid);

        }

        for (let i = 0; i < 30; i++) {
            createEnemies();
        }

        start();
    }
}


Startup.main();