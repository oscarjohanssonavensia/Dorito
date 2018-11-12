import { EngineContext } from '../Game';
import { Particle } from '../../models/Particle';
import { Vector } from '../math/vector';
import { SHIP_LENGTH_RADIUS, WORM_HOLE_IN_X, WORM_HOLE_IN_Y, WORM_HOLE_OUT_X, WORM_HOLE_OUT_Y, WHITE_HOLE_X, WHITE_HOLE_Y } from '../Consts';

import { shift as MapedgeShift, shift } from '../math/Mapedge';
import { coarse, fine, distanceBetween, distanceBetweenVectors, getGuid } from '../math/Collision';
import { explosion } from '../Create';
import Force from '../math/Force';
import { wormhole } from '../math/Force';
import Charge from '../../models/Charge';

import Imovable from '../../models/IMovable';
import { Ship, ProximityVectors } from '../../models/Ship';
import Types from '../../models/Types';
import { removeAsteroid } from './Asteroid';
import { removeEnemy } from './Enemies';


type ProximityResult = {
    vectors: ProximityVectors[],
    closestItem: Imovable,
    closestDistance: number,
};

const ELECTROBASTARDRAY_LIMIT = 200;
let electroBastardRayCooldown = ELECTROBASTARDRAY_LIMIT;
// TODO: use collisionGrid here
const proximityDetection = (ship: Imovable, list: Imovable[], maxDistance: number): ProximityResult => {

    const multip = 0.03;
    const fromOrigin = ship.radius * 1.3;
    const maxLen = 45;

    let closestDistance = Number.MAX_VALUE;
    let closestItem: Imovable = null;

    const vectors: ProximityVectors[] = [];
    const len = list.length;
    for (let e = 0; e < len; e++) {
        const item = list[e];
        const dist = distanceBetween(item, ship) - item.radius;
        if (dist < maxDistance) {

            if (dist < closestDistance) {
                closestDistance = dist;
                closestItem = item;
            }
            const angleRadians = Math.atan2(item.pos.y - ship.pos.y, item.pos.x - ship.pos.x);

            const v: Vector = new Vector(fromOrigin, fromOrigin);
            v.setAngle(angleRadians);

            //const v2: Vector = new Vector(ship.radius + 10, ship.radius + 10);
            const v2: Vector = new Vector(Math.min(fromOrigin + (maxDistance - dist) * multip, maxLen), Math.min(fromOrigin + (maxDistance - dist) * multip, maxLen));
            //const v2: Vector = new Vector(Math.min(30 * distMultip, 30), Math.min(30 * distMultip, 30));
            v2.setAngle(angleRadians);

            vectors.push({ from: v, to: v2 });
        }
    }

    return {
        closestDistance,
        closestItem,
        vectors,
    }

    // return result;
}

export default (ctx: EngineContext) => {

    const { keyCodes, game, step, WW, WH, SW, SX, SH, SY } = ctx;

    const ship = game.player;

    if (ship.shields > 0) {
        ship.shields--;
    }

    if (keyCodes.left) {
        ship.angle -= 0.05;

    }
    if (keyCodes.right) {
        ship.angle += 0.05;
    }


    if (keyCodes.up) {


        ship.thrust.setLength(0.1);
        ship.thrust.setAngle(ship.angle);

        for (let i = 0; i < 20; i++) {
            const vel = new Vector(0, 0);
            vel.setLength(4 - ship.vel.getLength());
            vel.setAngle(ship.angle + 3.06 + (Math.random() - 0.5) * 0.2);
            vel.mult(Math.random());

            const tp: Particle = {
                type: Types.TYPE_PARTICLE,
                guid: getGuid(),
                markNewForColliders: true,
                pos: new Vector(ship.pos.x + Math.cos(ship.angle) * -SHIP_LENGTH_RADIUS, ship.pos.y + Math.sin(ship.angle) * -SHIP_LENGTH_RADIUS),
                vel: vel,
                life: Math.random() * 20,
                radius: 1,

            }
            ship.thrustParticles.push(tp);

        }

    }
    else {
        ship.vel.mult(0.99);
        ship.thrust.setLength(0);

    }

    if (keyCodes.charge) {
        if (!ship.charge) {

            const vel = new Vector(ship.vel.x, ship.vel.y);
            vel.mult(0.5);
            //vel.setAngle(ship.angle + Math.PI);
            const pos = new Vector(ship.pos.x + Math.cos(ship.angle + Math.PI) * SHIP_LENGTH_RADIUS, ship.pos.y + Math.sin(ship.angle + Math.PI) * SHIP_LENGTH_RADIUS);
            const charge: Charge = {
                type: Types.TYPE_CHARGE,
                guid: getGuid(),
                markNewForColliders: true,
                pos,
                vel,
                timer: ship.chargeTimer,
                radius: 3,
                life: 1,
            };
            ship.charge = charge;
        }
    }

    if (ship.charge) {
        const charge = ship.charge;
        charge.timer -= step;
        if (charge.timer < 0) {
            ship.charge = null;
            explosion(game.forceField, 1200, charge.pos.x, charge.pos.y, game.particles, 0, 0, 220);
        }
        charge.pos.add(charge.vel);
        MapedgeShift(charge, WW, WH);
        Force(game.forceField, charge);
    }

    if (keyCodes.fire && ship.bullets.length < ship.maxBullets) {
        const vel = new Vector(0, 0);
        vel.setLength(ship.vel.getLength() + 10);
        vel.setAngle(ship.angle + (Math.random() - 0.5) * 0.02);

        const bullet: Particle = {
            type: Types.TYPE_BULLET,
            guid: getGuid(),
            markNewForColliders: true,
            pos: new Vector(ship.pos.x + Math.cos(ship.angle) * SHIP_LENGTH_RADIUS, ship.pos.y + Math.sin(ship.angle) * SHIP_LENGTH_RADIUS),
            vel: vel,
            life: 400,
            radius: 1,
        }
        shift(bullet, WW, WH); // Muy importante
        ship.bullets.push(bullet);
    }

    ship.vel.add(ship.thrust);


    if (ship.vel.getLength() > ship.maxVel) {
        ship.vel.setLength(ship.maxVel);
    }

    ship.pos.add(ship.vel);



    const layout = ship.layout;
    const rotatedLayout = ship.rotatedLayout;
    const rotatedLayoutPositioned = ship.rotatedLayoutPositioned;

    const angle = ship.angle + Math.PI;

    for (let i = 0; i < layout.length; i++) {
        const lp = layout[i];
        const x = lp.x * Math.cos(angle) - lp.y * Math.sin(angle);
        const y = lp.y * Math.cos(angle) + lp.x * Math.sin(angle);
        rotatedLayout[i].set(x, y);

        rotatedLayoutPositioned[i].set(x + ship.pos.x, y + ship.pos.y);
    }

    let safetyzoneMax = 0.8;
    let safetyzoneMin = 0.2;

    MapedgeShift(ship, WW - SW * safetyzoneMin, WH - SH * safetyzoneMin, SW * safetyzoneMin, SH * safetyzoneMin);
    Force(game.forceField, ship);
    wormhole(ship, WW, WH);


    safetyzoneMax = 0.65;
    safetyzoneMin = 0.35;

    const SSmodifier = 1;

    if (ship.pos.x > SX + SW * safetyzoneMax * SSmodifier) {
        ctx.SX = Math.floor(ship.pos.x - SW * safetyzoneMax * SSmodifier);
    } else if (ship.pos.x < SX + SW * safetyzoneMin * SSmodifier) {
        ctx.SX = Math.min(Math.floor(ship.pos.x - SW * safetyzoneMin * SSmodifier), WW - SW);
    }
    if (ship.pos.y > SY + SH * safetyzoneMax * SSmodifier) {
        ctx.SY = Math.floor(ship.pos.y - SH * safetyzoneMax * SSmodifier);
    } else if (ship.pos.y < SY + SH * safetyzoneMin * SSmodifier) {
        ctx.SY = Math.min(Math.floor(ship.pos.y - SH * safetyzoneMin * SSmodifier), WH - SH);
    }
    /*
    const numBullets = ship.bullets.length;
    for (let b = 0; b < numBullets; b++) {
        const bullet = ship.bullets[b];

        const enemies = game.enemies;
        const len = enemies.length;
        for (let e = 0; e < len; e++) {

            const enemy = enemies[e];
            const enemyVectors: Vector[] = [];
            const numEnemyVectors = enemy.rotatedLayout.length;
            for (let i = 0; i < numEnemyVectors; i++) {
                enemyVectors.push(new Vector(enemy.pos.x + enemy.rotatedLayout[i].x, enemy.pos.y + enemy.rotatedLayout[i].y));
            }



            if (coarse(bullet, enemy) && fine(numEnemyVectors, enemyVectors, bullet.pos)) {
                explosion(game.forceField, 9, enemy.pos.x, enemy.pos.y, game.particles);
                enemy.life--;
                ship.score++;

            }

        }

    }
    */


    // Proximity detection
    const enemyDetection = proximityDetection(ship, game.enemies, SW * 1.5);
    ship.enemyDetection = enemyDetection.vectors;

    const asteroidDetection = proximityDetection(ship, game.asteroids, SW * 0.4);
    ship.asterodDetection = asteroidDetection.vectors;
    const imovableBase = {
        vel: null,
        life: 0,
        radius: 0,
        markNewForColliders: true,
        guid: getGuid(),
        type: Types.TYPE_MISC,
    };
    const anomalies: Imovable[] = [
        {
            pos: new Vector(WORM_HOLE_IN_X * WW, WORM_HOLE_IN_Y * WH),
            ...imovableBase,
        },
        {
            pos: new Vector(WORM_HOLE_OUT_X * WW, WORM_HOLE_OUT_Y * WH),
            ...imovableBase,
        },
        {
            pos: new Vector(WHITE_HOLE_X * WW, WHITE_HOLE_Y * WH),
            ...imovableBase,
        }
    ];
    ship.anomalyDetection = proximityDetection(ship, anomalies, SW * 0.4).vectors;

    let closestItem = enemyDetection.closestItem;
    if (!closestItem || enemyDetection.closestDistance > SH * 0.4) {
        closestItem = asteroidDetection.closestItem;
    }
    ship.closestItem = closestItem;

    ship.electroBastardRay = false;
    if (keyCodes.electroBastardRay) {

        if (closestItem && electroBastardRayCooldown > 0) {
            electroBastardRayCooldown--;
            ship.electroBastardRay = true;
            closestItem.life--;

            if (closestItem.life < 0) {
                switch (closestItem.type) {
                    case Types.TYPE_ASTEROID:
                        removeAsteroid(closestItem, ctx, ship);
                        break;
                    case Types.TYPE_ENEMY:
                        // removeEnemy() // already handled in Enemy.ts   which seems wrong...

                        break;
                }
            }

            ship.life++;
            ship.shields++;

        }

    } else {

        if (electroBastardRayCooldown < ELECTROBASTARDRAY_LIMIT) {
            electroBastardRayCooldown++;
        }
    }
    ship.electroBastardRayCoolDown = electroBastardRayCooldown;

    ship.damageTaken = false;
}