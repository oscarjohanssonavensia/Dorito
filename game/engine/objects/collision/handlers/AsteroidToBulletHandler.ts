import { CollisionHandler } from '../CollisionGrid';
import Imovable from '../../../../models/IMovable';
import { EngineContext } from '../../../Game';
import { coarse, getGuid } from '../../../math/Collision';
import { explosion } from '../../../Create';
import { Vector } from '../../../math/vector';
import Asteroid from '../../../../models/Asteroid';


const asteroidToBulletHandler: CollisionHandler = (bullet: Imovable, asteroid: Imovable, ctx: EngineContext) => {

    if (coarse(asteroid, bullet)) {
        asteroid.life -= 25;

        bullet.remove = true;
        if (asteroid.life <= 0) {
            asteroid.remove = true;
            explosion(ctx.game.forceField, 100, asteroid.pos.x, asteroid.pos.y, ctx.game.particles);

            if (asteroid.radius > 5) {
                for (let s = 0; s < 5; s++) {
                    const vel = new Vector(Math.random() * 5, Math.random() * 5)
                    vel.setLength(Math.random() * 2);
                    const smallAsteroid: Asteroid = {
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
                    ctx.game.player.score += 5;
                    ctx.game.player.life += 5;
                    if (ctx.game.player.shields < 1000) {
                        ctx.game.player.shields += 200;
                    }
                }
            } else {
                ctx.game.player.score++;
                ctx.game.player.life++;

            }
        } else {
            explosion(ctx.game.forceField, 9, bullet.pos.x, bullet.pos.y, ctx.game.particles);
        }
    }
}

export default asteroidToBulletHandler;