import { EngineContext } from "../Game";
import { shift as MapedgeShift, shift } from '../math/Mapedge';
import { Vector } from '../math/vector';
import { Particle } from "../../models/Particle";
import { SHIP_LENGTH_RADIUS } from "../Consts";
import { coarse, fine, getGuid } from '../math/Collision';
import { explosion } from '../Create';
import Force from "../math/Force";
import { wormhole } from '../math/Force';

export default (ctx: EngineContext) => {
    const { game, SX, SY, SW, SH, WW, WH } = ctx;

    const player = game.player;
    const playerPos = player.pos;
    let enemies = game.enemies;
    let len = enemies.length;
    let angle = 0;
    const safetyzoneMax = 0.8;
    const safetyzoneMin = 0.2;
    /*
    const playerVectors: Vector[] = [];
    const numPlayerVectors = player.rotatedLayout.length;
    for (let i = 0; i < numPlayerVectors; i++) {
        playerVectors.push(new Vector(playerPos.x + player.rotatedLayout[i].x, playerPos.y + player.rotatedLayout[i].y));
    }
    */


    for (let e = 0; e < len; e++) {

        const enemyShip = enemies[e];
        const layout = enemyShip.layout;



        enemyShip.thrust.setLength(0.1);
        enemyShip.thrust.setAngle(enemyShip.angle);


        enemyShip.vel.add(enemyShip.thrust);


        if (enemyShip.vel.getLength() > enemyShip.maxVel) {
            enemyShip.vel.setLength(enemyShip.maxVel);
        }

        enemyShip.pos.add(enemyShip.vel);

        MapedgeShift(enemyShip, WW - SW * safetyzoneMin, WH - SH * safetyzoneMin, SW * safetyzoneMin, SH * safetyzoneMin);
        Force(game.forceField, enemyShip);
        wormhole(enemyShip, WW, WH);

        const rotatedLayout = enemyShip.rotatedLayout;
        const rotatedLayoutPositioned = enemyShip.rotatedLayoutPositioned;

        angle = enemyShip.angle + Math.PI;

        for (let i = 0; i < layout.length; i++) {
            const lp = layout[i];
            const x = lp.x * Math.cos(angle) - lp.y * Math.sin(angle);
            const y = lp.y * Math.cos(angle) + lp.x * Math.sin(angle);
            rotatedLayout[i].set(x, y);
            rotatedLayoutPositioned[i].set(x + enemyShip.pos.x, y + enemyShip.pos.y);
        }



        //ship.pos.x = playerPos.x * 0.9;
        //ship.pos.y = playerPos.y * 0.9;

        if (enemyShip.pos.x > SX && enemyShip.pos.x < SX + SW && enemyShip.pos.y > SY && enemyShip.pos.y < SY + SH) {

            var angleRadians = Math.atan2(playerPos.y - enemyShip.pos.y, playerPos.x - enemyShip.pos.x);
            //var angleRadians = Math.atan2(ship.pos.y - playerPos.y, ship.pos.x - playerPos.x);

            // angle in degrees
            var angleDeg = Math.atan2(playerPos.y - enemyShip.vel.y, playerPos.x - enemyShip.vel.x) * 180 / Math.PI;

            if (enemyShip.angle < angleRadians) {
                enemyShip.angle += 0.03;
            } else {
                enemyShip.angle -= 0.03;
            }


            if (enemyShip.bullets.length < enemyShip.maxBullets) {


                const vel = new Vector(0, 0);
                vel.setLength(enemyShip.vel.getLength() + 10);
                vel.setAngle(enemyShip.angle + (Math.random() - 0.5) * 0.02);

                const bullet: Particle = {
                    guid: getGuid(),
                    markNewForColliders: true,
                    pos: new Vector(enemyShip.pos.x + Math.cos(enemyShip.angle) * SHIP_LENGTH_RADIUS, enemyShip.pos.y + Math.sin(enemyShip.angle) * SHIP_LENGTH_RADIUS),
                    vel: vel,
                    life: 180,
                    radius: 1,
                }
                shift(bullet, WW, WH); // Muy importante
                enemyShip.bullets.push(bullet);
            }
        }


        if (enemyShip.life <= 0) {
            enemies.splice(e, 1);
            len--;
            e--;
            enemyShip.remove = true;
            explosion(game.forceField, 800, enemyShip.pos.x, enemyShip.pos.y, ctx.game.particles);

            // must remove bullets on enemy, or they will linger in collision grid forever...
            // TODO: move enemy bullets to root container on game

            const bullets = enemyShip.bullets;
            const numBullets = bullets.length;
            for (let b = 0; b < numBullets; b++) {
                const bullet = bullets[b];
                bullet.remove = true;
            }
            enemyShip.bullets = []; // release references

        }






    }

}