import { EngineContext } from '../Game';
import { shift as MapedgeShift } from '../math/Mapedge';
import Force from '../math/Force';
import { wormhole } from '../math/Force';
import Imovable from '../../models/IMovable';
import { Vector } from '../math/vector';
import Asteroid from '../../models/Asteroid';
import { getGuid, midpoint } from '../math/Collision';
import { explosion } from '../Create';
import { Ship } from '../../models/Ship';
import Types from '../../models/Types';
import AsteroidPart from '../../models/AsteroidPart';
import { doublePI } from '../Consts';
import { rotateVector } from '../math/Util';





const createAsteroidParts = (im: Imovable, ctx: EngineContext) => {

    const asteroid = im as Asteroid;
    let j = asteroid.sides;
    let oldX;
    let oldY;
    let newX;
    let newY;

    const posx = asteroid.pos.x;
    const posy = asteroid.pos.y;

    const radius = asteroid.radius * 0.8;
    const angle = asteroid.angle;
    const sides = j;

    oldX = (Math.cos(doublePI * (j / sides) + angle) * radius) >> 0;
    oldY = (Math.sin(doublePI * (j / sides) + angle) * radius) >> 0;
    newX = 0;
    newY = 0;

    for (j; j > -1; --j) {

        newX = (Math.cos(doublePI * (j / sides) + angle) * radius) >> 0;
        newY = (Math.sin(doublePI * (j / sides) + angle) * radius) >> 0;

        const edgeA = new Vector(newX, newY);
        const edgeB = new Vector(oldX, oldY);
        const edgeA_c = new Vector(oldX, oldY);


        const edgeA_p = new Vector(posx - newX, posy - newY);
        const edgeB_p = new Vector(posx - oldX, posy - oldY);


        const pos = midpoint(edgeA, edgeB, Math.random());
        pos.add(asteroid.pos);

        const vel = new Vector(newX, newY);
        vel.mult(0.1);
        const part: AsteroidPart = {
            edgeA,
            edgeB,
            rotatedEdgeA: new Vector(0, 0),
            rotatedEdgeB: new Vector(0, 0),

            pos: pos,
            angle: 0,
            angleVel: Math.random() * 0.01,
            vel,
            guid: getGuid(),
            type: Types.TYPE_ASTEROID_PART,
            life: 100 + Math.random() * 50,
            markNewForColliders: true,
            radius: asteroid.radius * 0.3,
        }


        ctx.game.asteroidParts.push(part)

        oldX = newX;
        oldY = newY;
    }


}

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
        createAsteroidParts(asteroid, ctx);
    } else {
        if (removedByShip) {
            removedByShip.score++;
            removedByShip.life++;
        }

    }
}



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

    let asteroidParts = game.asteroidParts;
    len = asteroidParts.length;
    for (let i = 0; i < len; i++) {
        const asteroidPart = asteroidParts[i];




        const velLen = asteroidPart.vel.getLength();
        if (velLen > 3) {
            asteroidPart.vel.setLength(3);
        }

        asteroidPart.pos.add(asteroidPart.vel);
        // asteroidPart.edgeA.add(asteroidPart.vel);
        // asteroidPart.edgeB.add(asteroidPart.vel);


        asteroidPart.angle += asteroidPart.angleVel;

        if (velLen > 0.2) {
            asteroidPart.vel.mult(0.98);
        }
        asteroidPart.angleVel *= 0.99;



        const angle = asteroidPart.angle;

        asteroidPart.rotatedEdgeA = rotateVector(asteroidPart.edgeA, angle, asteroidPart.rotatedEdgeA);
        asteroidPart.rotatedEdgeB = rotateVector(asteroidPart.edgeB, angle, asteroidPart.rotatedEdgeB);



        MapedgeShift(asteroidPart, WW, WH);
        Force(game.forceField, asteroidPart);
        wormhole(asteroidPart, WW, WH);


        /*
        if (asteroidPart.remove) {
            asteroidParts.splice(i, 1);
            len--;
            i--;
        }

        asteroidPart.life--;
        if (asteroidPart.life < 0) {
            //  asteroidPart.remove = true;
        }*/






    }

    while (asteroidParts.length > 200) {
        asteroidParts.shift();

    }
}