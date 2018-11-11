/*import Game from "./models/Game";
import { GuiContext, stats } from './gui/Game';
import { EngineContext, init as EngineInit, resize as EngineResize, init } from './engine/Game';
import Gui from './gui/Game';
import Engine from './engine/Game';
import KeyCodes from "./models/KeyCodes";
import { Ship } from './models/Ship';
import { Vector } from './engine/math/vector';
import Asteroid from "./models/Asteroid";
import { SHIP_LENGTH_RADIUS, SHIP_WIDTH_RADIUS, FORCE_FIELD_RESOLUTION, ASTEROID_RADIUS_LIFE_MULTIP } from './engine/Consts';
import { Particle } from './models/Particle';



const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const FIRE = 32;
const CHARGE = 17;

export default (ctx: CanvasRenderingContext2D, SW: number, SH: number) => {

    const FPS = 1000 / 60;
    const it = performance.now();
    const imgData: ImageData = new ImageData(SW, SH);
    const itt = performance.now() - it;
    console.log('created frame in ' + itt);
    const game: Game = new Game();
    game.starMap = [];
    game.particles = [];
    game.asteroids = [];
    game.enemies = [];
    game.forceField = [];
    game.performance = {
        gui: [],
        engine: [],
        particles: 0,
        asteroids: 0,
    }

    let ticks = 0;
    let t = new Date().getTime();
    let tt = t;
    let step = 0;

    window['game'] = game;

    const WW = SW * 10;  // somethings break when changing this. it should not....
    const WH = SH * 10;

    const keyCodes: KeyCodes = {
        left: false,
        up: false,
        right: false,
        down: false,
        fire: false,
        charge: false,
    };

    const fx = WW * FORCE_FIELD_RESOLUTION;
    const fy = WH * FORCE_FIELD_RESOLUTION;

    for (let y = 0; y < fy; y++) {
        const row: Vector[] = [];
        for (let x = 0; x < fx; x++) {
            row.push(new Vector(0, 0));
        }
        game.forceField.push(row);
    }


    for (let i = 0; i < 300; i++) {

        const velocity = new Vector((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10);
        velocity.setLength(1 * Math.random());
        velocity.setAngle((Math.random() - 0.5) * (Math.PI * 2))
        const radius = Math.random() > 0.97 ? 400 : Math.random() * 50 + 50;
        const asteroid: Asteroid = {
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

    game.enemies = [];

    for (var i = 0; i < 20; i++) {

        const enemy: Ship = {
            chargeTimer: 200,
            shields: 0,
            anomalyDetection: [],
            enemyDetection: [],
            asterodDetection: [],
            score: 0,
            bullets: [],
            maxBullets: 10,
            damageTaken: false,
            maxVel: 3,
            thrustParticles: [],
            life: 5,
            radius: Math.max(SHIP_LENGTH_RADIUS, SHIP_WIDTH_RADIUS),
            s: 1,
            vx: 0.1,
            vy: 0.1,
            x: WW * Math.random(),
            y: WH * Math.random(),
            angle: 0,
            pos: new Vector(WW * Math.random(), WH * Math.random()),
            thrust: new Vector(0.0001, 0.0001),
            vel: new Vector(0.0001, 0.0001),
            layout: [
                new Vector(-SHIP_LENGTH_RADIUS, 0),
                new Vector(SHIP_LENGTH_RADIUS, -SHIP_WIDTH_RADIUS),
                new Vector(SHIP_LENGTH_RADIUS, SHIP_WIDTH_RADIUS),
            ],
            rotatedLayout: [
                new Vector(-SHIP_LENGTH_RADIUS, 0),
                new Vector(SHIP_LENGTH_RADIUS, -SHIP_WIDTH_RADIUS),
                new Vector(SHIP_LENGTH_RADIUS, SHIP_WIDTH_RADIUS),
            ],
            rotatedLayoutPositioned: [
                new Vector(-SHIP_LENGTH_RADIUS, 0),
                new Vector(SHIP_LENGTH_RADIUS, -SHIP_WIDTH_RADIUS),
                new Vector(SHIP_LENGTH_RADIUS, SHIP_WIDTH_RADIUS),
            ],
        }
        game.enemies.push(enemy);
    }

    game.player = {
        chargeTimer: 200,
        shields: 600,
        enemyDetection: [],
        asterodDetection: [],
        anomalyDetection: [],
        score: 0,
        bullets: [],
        maxBullets: 10,
        maxVel: 10,
        thrustParticles: [],
        life: 100,
        radius: Math.max(SHIP_LENGTH_RADIUS, SHIP_WIDTH_RADIUS),
        s: 1,
        vx: 0.1,
        vy: 0.1,
        x: SW * 0.5,
        y: SH * 0.5,
        damageTaken: false,
        angle: 0,
        pos: new Vector(WW * Math.random(), WH * Math.random()),
        thrust: new Vector(0, 0),
        vel: new Vector(0, 0),
        layout: [
            new Vector(-SHIP_LENGTH_RADIUS, 0),
            new Vector(SHIP_LENGTH_RADIUS, -SHIP_WIDTH_RADIUS),
            new Vector(SHIP_LENGTH_RADIUS, SHIP_WIDTH_RADIUS),
        ],
        rotatedLayout: [
            new Vector(-SHIP_LENGTH_RADIUS, 0),
            new Vector(SHIP_LENGTH_RADIUS, -SHIP_WIDTH_RADIUS),
            new Vector(SHIP_LENGTH_RADIUS, SHIP_WIDTH_RADIUS),
        ],
        rotatedLayoutPositioned: [
            new Vector(-SHIP_LENGTH_RADIUS, 0),
            new Vector(SHIP_LENGTH_RADIUS, -SHIP_WIDTH_RADIUS),
            new Vector(SHIP_LENGTH_RADIUS, SHIP_WIDTH_RADIUS),
        ],
    };


    const updateKeys = (key: number, down: boolean) => {
        switch (key) {
            case LEFT:
                keyCodes.left = down;
                break;
            case UP:
                keyCodes.up = down;
                break;
            case RIGHT:
                keyCodes.right = down;
                break;
            case DOWN:
                keyCodes.down = down;
                break;
            case FIRE:
                keyCodes.fire = down;
                break;

            case CHARGE:
                keyCodes.charge = down;
                break;
            default:

                break;

        }


    }

    window.addEventListener('keydown', (ev: KeyboardEvent) => {
        updateKeys(ev.keyCode, true);
    });

    window.addEventListener('keyup', (ev: KeyboardEvent) => {
        updateKeys(ev.keyCode, false);
    });

    const guiContext: GuiContext = {
        step: 0,
        stepMS: 0,
        ctx,
        frame: imgData.data,
        imageData: imgData,
        game,
        SW,
        SH,
        WW,
        WH,
        SX: game.player.pos.x - SW * 0.5,
        SY: game.player.pos.y - SH * 0.5,
    };

    const engineContext: EngineContext = {
        SW,
        SH,
        WW,
        WH,
        SX: 0,
        SY: 0,
        game,
        step: 0,
        stepMS: 0,
        keyCodes,
    };

    EngineInit(engineContext);

    setInterval(() => {


        // TIME

        ticks++;
        t = tt;
        tt = new Date().getTime();
        step = tt - t;
        const stepM = step * 0.1;

        engineContext.stepMS = step;
        engineContext.step = stepM;
        engineContext.SW = SW;
        engineContext.SH = SH;

        guiContext.stepMS = step;
        guiContext.step = stepM;
        guiContext.SW = SW;
        guiContext.SH = SH;

        guiContext.SX = engineContext.SX;
        guiContext.SY = engineContext.SY;


        Engine(engineContext);


        const engineTime = new Date().getTime() - tt;
        Gui(guiContext);
        const guiTime = new Date().getTime() - (tt + engineTime);

        stats(guiContext, engineTime, guiTime);

        //console.log(step, game.particles.length);

    }, FPS);

}*/



import initialization, { start, createAsteroid, SW_init as SW, SH_init as SH, WH_init as WH, WW_init as WW } from "./init/initialization";
import { Vector } from "./engine/math/vector";
import Asteroid from "./models/Asteroid";
import { ASTEROID_RADIUS_LIFE_MULTIP } from "./engine/Consts";
import { createEnemies } from './init/initialization';
import { getGuid } from './engine/math/Collision';




export default class Startup {

    public static main() {

        const game = initialization();

        const player = game.player;

        //       player.pos = new Vector(WW * Math.random(), WH * Math.random()),



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