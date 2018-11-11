import initialization, { start, createAsteroid, SW_init as SW, SH_init as SH } from "../init/initialization";
import Game from "../models/Game";
import { EngineContext } from '../engine/Game';
import { GuiContext } from '../gui/Game';
import MeasureTime from "../engine/math/MeasureTime";
import Clear from "../gui/objects/Clear";
import Asteroids from "../gui/objects/Asteroids";
import { bounce } from '../engine/math/Mapedge';
import CollisionGrid from "../engine/objects/collision/CollisionGrid";
import { MeasureTimeFn } from '../engine/math/MeasureTime';

import ShipGui from "../gui/objects/Ship";
import ShipEngine from "../engine/objects/Ship";
import Grid3dMapper from "../engine/objects/collision/Grid3dMapper";
import { Grid3dSingleListCollider, Grid3dSingleListColliderBounce, grid3dColliderBounce, cleanList } from '../engine/objects/collision/Grid3dColliders';
import { CollisionHandler } from '../engine/objects/collision/CollisionGrid';
import Imovable from "../models/IMovable";
import { resolve } from '../engine/math/Collision';
import playerToAsteroidHandler from '../engine/objects/collision/handlers/playerToAsteroidHandler';
import Debug from "../gui/objects/Debug";
import { updateGrid3d, addNewToGrid3d } from '../engine/objects/collision/Grid3dMapper';
import Asteroid from '../models/Asteroid';


const ShipUpdater = (ctx: EngineContext) => {

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
    }
    else {
        ship.vel.mult(0.99);
        ship.thrust.setLength(0);
    }

    ship.vel.add(ship.thrust);


    /*if (ship.vel.getLength() > ship.maxVel) {
        ship.vel.setLength(ship.maxVel);
    }*/

    ship.pos.add(ship.vel);

    bounce(ship, WW, WH);


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


}

const AsteroidUpdater = (ctx: EngineContext) => {

    const { game, WW, WH } = ctx;

    const asteroids = game.asteroids;

    let len = asteroids.length;
    for (let i = 0; i < len; i++) {
        const asteroid = asteroids[i];



        const velLen = asteroid.vel.getLength();
        if (velLen > 30) {
            asteroid.vel.setLength(30);
        }

        asteroid.pos.add(asteroid.vel);
        asteroid.angle += asteroid.angleVel;

        // asteroid.vel.y += 0.8;

        asteroid.vel.y += 0.1;


        if (asteroid.pos.x < 200 && asteroid.pos.y + asteroid.radius + 20 > WH) {
            asteroid.remove = true;

            createAsteroid(WW * 0.8, 100, 0, 0, 20);
        }

        if (bounce(asteroid, WW, WH)) {

        }

        if (Math.abs(asteroid.angleVel) > 0.00001) {
            asteroid.angleVel *= 0.8;
        } else {
            asteroid.angleVel = 0;

        }

    }
}

const genericHandler: CollisionHandler = (a: Imovable, b: Imovable, ctx: EngineContext) => resolve(a, b);

let asteroidsGrid3d: Imovable[][][] = null;
const collisionHandler = (ctx: EngineContext) => {

    const { game, WW, WH } = ctx;



    const asteroids = game.asteroids;

    if (!asteroidsGrid3d) {
        asteroidsGrid3d = Grid3dMapper([], WW, WH);
    }
    updateGrid3d(asteroidsGrid3d);
    addNewToGrid3d(asteroidsGrid3d, asteroids);

    game.debug = {
        asteroids: asteroidsGrid3d,
        enemies: [],
        enemyBullets: [],
        playerBullets: [],
    };
    Grid3dSingleListColliderBounce(asteroidsGrid3d, genericHandler, ctx);
    grid3dColliderBounce(game.player, asteroidsGrid3d, playerToAsteroidHandler, ctx);

    game.asteroids = cleanList(game.asteroids) as Asteroid[];
}

const engine = (ctx: EngineContext) => {
    const { game, WW, WH, SW, SH } = ctx;

    //console.log(WW, WH, SW, SH);
    ctx.game.performance.engine = [];



    MeasureTime(AsteroidUpdater, ctx, true);
    MeasureTime(ShipUpdater, ctx, true);
    MeasureTime(collisionHandler, ctx, true);




    game.performance.asteroids = game.asteroids.length;

}

const gui = (guictx: GuiContext) => {
    const { ctx, imageData, game } = guictx;

    game.performance.gui = [];

    MeasureTime(Clear, guictx, false);
    MeasureTime(Asteroids, guictx, false);
    MeasureTime(ShipGui, guictx, false);
    Debug(guictx);

    MeasureTimeFn(() => ctx.putImageData(imageData, 0, 0), game.performance.gui);
}

export default class Startup {


    public static main() {
        const WORLD_MULTIP = 1;

        const game = initialization(SW, SH, SW * WORLD_MULTIP, SH * WORLD_MULTIP);
        game.player.pos.x = SW * 0.5;
        game.player.pos.y = SH * 0.5;
        game.testMode = true;

        for (let i = 0; i < 180; i++) {
            createAsteroid(SW * Math.random(), SH * Math.random(), (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, 5 + Math.random() * 40);
        }

        createAsteroid(SW * 0.5, SH * 0.4, 0, 0, 120);



        start(gui, engine, SW, SH, SW * WORLD_MULTIP, SH * WORLD_MULTIP);
    }
}


Startup.main();