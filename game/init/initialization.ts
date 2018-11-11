import Game from "../models/Game";
import { GuiContext, stats } from '../gui/Game';
import { EngineContext, init as EngineInit, resize as EngineResize, init } from '../engine/Game';
import Gui from '../gui/Game';
import Engine from '../engine/Game';
import KeyCodes from "../models/KeyCodes";
import { Ship } from '../models/Ship';
import { Vector } from '../engine/math/vector';
import Asteroid from "../models/Asteroid";
import { SHIP_LENGTH_RADIUS, SHIP_WIDTH_RADIUS, FORCE_FIELD_RESOLUTION } from '../engine/Consts';
import { Particle } from '../models/Particle';
import { getGuid } from '../engine/math/Collision';
import Text from "../gui/text/CreateText";
import Clear from "../gui/objects/Clear";
import { ClearHard } from '../gui/objects/Clear';



const LEFT = 37;
const UP = 38;
const RIGHT = 39;
const DOWN = 40;
const FIRE = 32;
const CHARGE = 17;

const game: Game = new Game();

let guiContext: GuiContext = null;
let engineContext: EngineContext = null;

const SW = window.innerWidth;
const SH = window.innerHeight;
const WW = SW * 10;
const WH = SH * 10;

export const SW_init = SW
export const SH_init = SH;
export const WW_init = WW;
export const WH_init = WH;

const __ww = WW;
const __wh = WH;
const __sw = SW;
const __sh = SH;


export const createAsteroid = (posx: number, posy: number, velx: number, vely: number, radius: number) => {
    const asteroid: Asteroid = {
        guid: getGuid(),
        markNewForColliders: true,
        pos: new Vector(posx, posy),
        radius: radius,
        vel: new Vector(velx, vely),
        sides: (Math.random() * 2 + 7) >> 0,
        angle: 0,
        angleVel: 0.01,
        life: radius,
    }
    game.asteroids.push(asteroid);
}

export const createEnemies = () => {
    const enemy: Ship = {
        guid: getGuid(),
        markNewForColliders: true,
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


export default (SW: number = __sw, SH: number = __sh, WW: number = __ww, WH: number = __wh, drawFirstState: boolean = false) => {


    console.log(SW, SH);
    console.log(WW, WH);
    const canvas = document.getElementById('stage') as HTMLCanvasElement;
    canvas.width = SW;
    canvas.height = SH;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, SW, SH);
    const imgData = ctx.getImageData(0, 0, SW, SH);


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

    if (window.location.href.indexOf('?debug') > -1) {
        game.debug = {};
    }



    window['game'] = game;

    console.log('gitted')



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





    game.enemies = [];

    game.player = {
        guid: getGuid(),
        markNewForColliders: true,
        chargeTimer: 200,
        shields: 600,
        enemyDetection: [],
        asterodDetection: [],
        anomalyDetection: [],
        score: 0,
        bullets: [],
        maxBullets: 150,
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
        pos: new Vector(SW * 0.9, SH * 0.9),
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

    guiContext = {
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

    engineContext = {
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

    setTimeout(() => {
        EngineInit(engineContext);



        setTimeout(() => {
            Gui(guiContext); // draw current state once to initialize all textbuffering 

            setTimeout(() => {

                ClearHard(guiContext);

                setTimeout(() => {
                    let str = 'Loading... DORITO |>'
                    if (game.testMode) {
                        str += '@test';
                    }
                    const loadingBuffer = Text.create(str, 100, 'r');
                    Text.add(SW, imgData.data, loadingBuffer, 200, 200);
                    ctx.putImageData(imgData, 0, 0);
                }, 0)
            }, 0)

        }, 0);
    }, 0);
    return game;


}
export const start = (_gui?: Function, _engine?: Function, SW: number = __sw, SH: number = __sh, WW: number = __ww, WH: number = __wh) => {


    console.log(guiContext);

    const FPS = 1000 / 60;
    let ticks = 0;
    let t = performance.now();
    let tt = t;
    let step = 0;

    const gui = _gui || Gui;
    const engine = _engine || Engine;

    const loop = () => {







        // TIME

        ticks++;
        t = tt;
        tt = performance.now();
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


        engine(engineContext);


        const engineTime = performance.now() - tt;
        gui(guiContext);
        const guiTime = performance.now() - (tt + engineTime);

        stats(guiContext, engineTime, guiTime);

        //console.log(step, game.particles.length);


        requestAnimationFrame(loop);
    }


    setTimeout(() => loop(), game.testMode ? 500 : 2500);


}