import { EngineContext } from '../../Game';
import Imovable from '../../../models/IMovable';
import { coarse, resolve, getGuid } from '../../math/Collision';
import { explosion } from "../../Create";
import Asteroid from '../../../models/Asteroid';
import { Vector } from "../../math/vector";
import playerToEnemyHandler from './handlers/PlayerToEnemyHandler';
import playerBulletToEnemyHandler from './handlers/playerBulletToEnemyHandler';
import playerToAsteroidHandler from "./handlers/playerToAsteroidHandler";
import playerToEnemyBulletHandler from "./handlers/playerToEnemyBulletHandler";
import playerWithShieldToEnemyBulletHandler from "./handlers/playerWithShieldToEnemyBulletHandler";
import playerWithShieldToEnemyHandler from './handlers/playerWithShieldToEnemyHandler';

import Grid3dMapper from "./Grid3dMapper";
import { Ship } from '../../../models/Ship';
import { Grid3dListCollider, Grid3dSingleListCollider, grid3dCollider, cleanList, grid3dCollider_2, Grid3dSingleListCollider_2, Grid3dListCollider_NoLargeChecks } from './Grid3dColliders';
import { updateGrid3d, addNewToGrid3d, RESOLUTION, updateGrid3dRadiusBased } from './Grid3dMapper';
import playerWithShieldToAsteroidHandler from './handlers/playerWithShieldToAsteroidHandler';
import { shift } from '../../math/Mapedge';
import asteroidToBulletHandler from './handlers/AsteroidToBulletHandler';





export interface CollisionHandler {
    (a: Imovable, b: Imovable, ctx: EngineContext);
}



const genericHandler: CollisionHandler = (a: Imovable, b: Imovable, ctx: EngineContext) => {
    if (resolve(a, b)) {
        shift(a, ctx.WW, ctx.WH);
        shift(b, ctx.WW, ctx.WH);
    }
}

const getAllEnemenyBullets = (list: Ship[]) => {
    const res: Imovable[] = [];
    const len = list.length;

    for (let i = 0; i < len; i++) {
        const enemy = list[i];
        const bullets = enemy.bullets;
        const numBullets = bullets.length;
        for (let b = 0; b < numBullets; b++) {

            res.push(bullets[b]);
        }
    }
    return res;
}

let asteroidsGrid3d: Imovable[][][] = null;
let enemiesGrid3d: Imovable[][][] = null;
let playerBulletsGrid3d: Imovable[][][] = null;
let enemyBulletsGrid3d: Imovable[][][] = null;

let increasedSectorsGrid3d: Imovable[][][] = null;


const filterOutIncreasedSectors = (list: Imovable[], threshold: number): Imovable[] => {

    const res: Imovable[] = [];
    const len = list.length;
    for (let i = 0; i < len; i++) {
        const item = list[i];

        if (item.radius > threshold) {
            res.push(item);
        }
    }
    return res;
}

const getRemovedOnly = (list: Imovable[]) => {
    const res: Imovable[] = [];
    const len = list.length;
    for (let i = 0; i < len; i++) {
        const item = list[i];
        if (item.remove) {
            res.push(item);
        }
    }
    return res;
}

export default (ctx: EngineContext) => {

    const { game, WW, WH } = ctx;



    const asteroids = game.asteroids;
    const enemies = game.enemies;
    const player = game.player;

    const allEnemyBullets = getAllEnemenyBullets(enemies);

    if (!asteroidsGrid3d) {
        asteroidsGrid3d = Grid3dMapper([], WW, WH);
    }
    if (!enemiesGrid3d) {
        enemiesGrid3d = Grid3dMapper([], WW, WH);
    }
    if (!playerBulletsGrid3d) {
        playerBulletsGrid3d = Grid3dMapper([], WW, WH);
    }
    if (!enemyBulletsGrid3d) {
        enemyBulletsGrid3d = Grid3dMapper([], WW, WH);
    }

    if (!increasedSectorsGrid3d) {
        increasedSectorsGrid3d = Grid3dMapper([], WW, WH);
    }

    // increased sector mapping
    const sectorSize = ctx.WW / (ctx.WW * RESOLUTION) * 0.5;
    const largeItems = filterOutIncreasedSectors(asteroids, sectorSize);
    //  updateGrid3d(increasedSectorsGrid3d);
    // addNewToGrid3d(increasedSectorsGrid3d, largeItems)

    //cleanup increasedSectorGrid
    updateGrid3dRadiusBased(increasedSectorsGrid3d, largeItems, true);
    updateGrid3dRadiusBased(increasedSectorsGrid3d, largeItems, false);
    // END increased sector mapping

    updateGrid3d(asteroidsGrid3d);
    updateGrid3d(enemiesGrid3d);
    updateGrid3d(playerBulletsGrid3d);
    updateGrid3d(enemyBulletsGrid3d);

    addNewToGrid3d(asteroidsGrid3d, asteroids);
    addNewToGrid3d(enemiesGrid3d, enemies);
    addNewToGrid3d(playerBulletsGrid3d, player.bullets);
    addNewToGrid3d(enemyBulletsGrid3d, allEnemyBullets);

    //-----------


    Grid3dSingleListCollider_2(asteroidsGrid3d, increasedSectorsGrid3d, asteroids, genericHandler, ctx);
    //Grid3dSingleListCollider(asteroidsGrid3d, genericHandler, ctx);

    Grid3dSingleListCollider_2(asteroidsGrid3d, increasedSectorsGrid3d, player.bullets, asteroidToBulletHandler, ctx);
    //Grid3dListCollider(asteroidsGrid3d, playerBulletsGrid3d, asteroidToBulletHandler, ctx);

    Grid3dSingleListCollider_2(asteroidsGrid3d, increasedSectorsGrid3d, enemies, genericHandler, ctx);
    //Grid3dListCollider(asteroidsGrid3d, enemiesGrid3d, genericHandler, ctx);

    Grid3dListCollider_NoLargeChecks(enemiesGrid3d, player.bullets, playerBulletToEnemyHandler, ctx);
    //Grid3dListCollider(enemiesGrid3d, playerBulletsGrid3d, playerBulletToEnemyHandler, ctx);



    if (game.player.shields > 0) {

        grid3dCollider_2(player, asteroidsGrid3d, increasedSectorsGrid3d, playerWithShieldToAsteroidHandler, ctx);
        // grid3dCollider(player, asteroidsGrid3d, playerWithShieldToAsteroidHandler, ctx);

        grid3dCollider(player, enemyBulletsGrid3d, playerWithShieldToEnemyBulletHandler, ctx);
        grid3dCollider(player, enemiesGrid3d, playerWithShieldToEnemyHandler, ctx);

    } else if (game.player.life > 0) {
        grid3dCollider_2(player, asteroidsGrid3d, increasedSectorsGrid3d, playerToAsteroidHandler, ctx);
        //grid3dCollider(player, asteroidsGrid3d, playerToAsteroidHandler, ctx);
        grid3dCollider(player, enemyBulletsGrid3d, playerToEnemyBulletHandler, ctx);
        grid3dCollider(player, enemiesGrid3d, playerToEnemyHandler, ctx);

    }



    if (game.debug) {
        const debug = (game.debug as any);

        debug.asteroids = asteroidsGrid3d;
        debug.enemies = enemiesGrid3d;
        debug.enemyBullets = enemyBulletsGrid3d;
        debug.playerBullets = playerBulletsGrid3d;
        debug.increasedSectors = increasedSectorsGrid3d; // JSON.parse(JSON.stringify(increasedSectorsGrid3d)),
    }



    // ALL CLEANUP BELOW

    updateGrid3dRadiusBased(increasedSectorsGrid3d, getRemovedOnly(largeItems), true);
    //cleanup removed all :Imovable flagged for removal
    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        enemy.bullets = cleanList(enemy.bullets)
    }
    game.asteroids = cleanList(game.asteroids) as Asteroid[];
    game.player.bullets = cleanList(game.player.bullets);



}