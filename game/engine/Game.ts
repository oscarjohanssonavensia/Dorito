import Game from "../models/Game";
import Starmap, { init as StarmapInit, resize as StarmapResize } from "./objects/Starmap";
import { explosion } from './Create';
import Particles from "./objects/Particles";
import KeyCodes from "../models/KeyCodes";
import Ship from "./objects/Ship";
import Asteroid from "./objects/Asteroid";
import Enemies from "./objects/Enemies";
import ForceField from "./objects/ForceField";
import MeasureTime from "./math/MeasureTime";
import Collisions from "./objects/Collisions";
import CollisionGrid from "./objects/collision/CollisionGrid";




export type EngineContext = {
    game: Game;
    step: number;
    stepMS: number;
    SW: number;
    SH: number;
    WW: number;
    WH: number;
    SX: number;
    SY: number;
    keyCodes: KeyCodes;
}

export const init = (ctx: EngineContext) => {
    StarmapInit(ctx);
}

export const resize = (ctx: EngineContext) => {
    StarmapResize(ctx);
}

export default (ctx: EngineContext) => {
    const { game } = ctx;

    ctx.game.performance.engine = [];
    MeasureTime(ForceField, ctx, true);
    MeasureTime(Ship, ctx, true);
    MeasureTime(Starmap, ctx, true);
    MeasureTime(Particles, ctx, true);
    MeasureTime(Enemies, ctx, true);
    MeasureTime(Asteroid, ctx, true);
    MeasureTime(CollisionGrid, ctx, true);
    //MeasureTime(Collisions, ctx, true);

    game.performance.asteroids = game.asteroids.length;


    // TODO: MOVE thrustparticles to custompoarticles 

    let totalNumParticles = game.customParticles.length + game.particles.length + game.player.bullets.length + game.player.thrustParticles.length;
    for (let i = 0; i < game.enemies.length; i++) {
        const enemy = game.enemies[i];
        totalNumParticles += enemy.bullets.length + enemy.thrustParticles.length;
    }

    game.performance.particles = totalNumParticles;


}