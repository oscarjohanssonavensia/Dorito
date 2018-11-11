import { EngineContext } from "../Game";
import Imovable from '../../models/IMovable';
import { coarse, resolve, getGuid } from '../math/Collision';
import { explosion } from "../Create";
import Asteroid from '../../models/Asteroid';
import { Vector } from "../math/vector";
import { singleListCollider, listCollider, collider, cleanList } from "./collision/Colliders";
import playerToEnemyHandler from "./collision/handlers/PlayerToEnemyHandler";
import playerBulletToEnemyHandler from "./collision/handlers/playerBulletToEnemyHandler";
import playerToAsteroidHandler from "./collision/handlers/playerToAsteroidHandler";
import playerToEnemyBulletHandler from "./collision/handlers/playerToEnemyBulletHandler";
import playerWithShieldToEnemyBulletHandler from "./collision/handlers/playerWithShieldToEnemyBulletHandler";
import playerWithShieldToEnemyHandler from "./collision/handlers/playerWithShieldToEnemyHandler";
import playerWithShieldToAsteroidHandler from "./collision/handlers/PlayerWithShieldToAsteroid";


let updatedAsteroidsList: Asteroid[] = [];


export interface CollisionHandler {
    (a: Imovable, b: Imovable, ctx: EngineContext);
}


// TODO: unify this with other handlers so it can be generic and extracted

const asteroidToBulletHandler: CollisionHandler = (asteroid: Imovable, bullet: Imovable, ctx: EngineContext) => {

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
                    updatedAsteroidsList.push(smallAsteroid);
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



const genericHandler: CollisionHandler = (a: Imovable, b: Imovable, ctx: EngineContext) => resolve(a, b);

export default (ctx: EngineContext) => {

    const { game } = ctx;

    updatedAsteroidsList = [];

    const asteroids = game.asteroids;
    const enemies = game.enemies;

    singleListCollider(asteroids, genericHandler, ctx);

    listCollider(asteroids, game.player.bullets, asteroidToBulletHandler, ctx);

    listCollider(asteroids, game.enemies, genericHandler, ctx);

    listCollider(enemies, game.player.bullets, playerBulletToEnemyHandler, ctx);

    if (game.player.shields > 0) {

        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            const enemyBullets = enemy.bullets;
            collider(game.player, enemyBullets, playerWithShieldToEnemyBulletHandler, ctx);
        }

        collider(game.player, enemies, playerWithShieldToEnemyHandler, ctx);
        collider(game.player, asteroids, playerWithShieldToAsteroidHandler, ctx);
    } else if (game.player.life > 0) {

        collider(game.player, asteroids, playerToAsteroidHandler, ctx);
        collider(game.player, enemies, playerToEnemyHandler, ctx);
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            const enemyBullets = enemy.bullets;
            collider(game.player, enemyBullets, playerToEnemyBulletHandler, ctx);
        }

    }




    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        //cleanup
        enemy.bullets = cleanList(enemy.bullets)
    }
    game.asteroids = cleanList(game.asteroids, updatedAsteroidsList) as Asteroid[];
    game.player.bullets = cleanList(game.player.bullets);


}