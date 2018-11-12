import { CollisionHandler } from '../CollisionGrid';
import Imovable from '../../../../models/IMovable';
import { EngineContext } from '../../../Game';
import { coarse, getGuid } from '../../../math/Collision';
import { explosion } from '../../../Create';
import { Vector } from '../../../math/vector';
import Asteroid from '../../../../models/Asteroid';
import { removeAsteroid } from '../../../../gui/objects/Asteroids';


const asteroidToBulletHandler: CollisionHandler = (bullet: Imovable, asteroid: Imovable, ctx: EngineContext) => {

    if (coarse(asteroid, bullet)) {
        asteroid.life -= 25;

        bullet.remove = true;
        if (asteroid.life <= 0) {
            removeAsteroid(asteroid, ctx, ctx.game.player);
        } else {
            explosion(ctx.game.forceField, 9, bullet.pos.x, bullet.pos.y, ctx.game.particles);
        }
    }
}

export default asteroidToBulletHandler;