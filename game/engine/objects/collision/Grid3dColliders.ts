import Imovable from '../../../models/IMovable';
import { CollisionHandler } from "../Collisions";
import { EngineContext } from "../../Game";
import { RESOLUTION, getSectorsAsFlatListWrapped, getSectorsAsFlatList } from './Grid3dMapper';

export const cleanList = (list: Imovable[], pushlist?: Imovable[]) => {
    const cleaned = pushlist || [];
    const len = list.length;
    for (let i = 0; i < len; i++) {
        const item = list[i];
        if (!item.remove) {
            cleaned.push(item);
        }
    }
    return cleaned;
}


export const Grid3dListCollider_NoLargeChecks = (otherGrid3d: Imovable[][][], list: Imovable[], handler: CollisionHandler, ctx: EngineContext) => {


    const len = list.length;
    for (let a = 0; a < len; a++) {
        const item: Imovable = list[a];
        grid3dCollider(item, otherGrid3d, handler, ctx);
    }

}
export const Grid3dSingleListCollider_2 = (grid3d: Imovable[][][], grid3dLargeRadius: Imovable[][][], list: Imovable[], handler: CollisionHandler, ctx: EngineContext) => {

    const len = list.length;
    for (let i = 0; i < len; i++) {
        const a: Imovable = list[i];
        grid3dCollider_2(a, grid3d, grid3dLargeRadius, handler, ctx);
    }
}
export const Grid3dSingleListCollider = (grid3d: Imovable[][][], handler: CollisionHandler, ctx: EngineContext) => {

    const GRID_W = grid3d[0].length;
    const GRID_H = grid3d.length;

    for (let y = 0; y < GRID_H; y++) {
        for (let x = 0; x < GRID_W; x++) {

            if (grid3d[y][x].length > 0) {

                const sectors = getSectorsAsFlatListWrapped(grid3d, x, y);

                const len = sectors.length;
                for (let i = 0; i < len; i++) {
                    const a = sectors[i];

                    collider(grid3d, a, sectors, handler, ctx, i);
                }
            }
        }
    }
}


// for test only
export const Grid3dSingleListColliderBounce = (grid3d: Imovable[][][], handler: CollisionHandler, ctx: EngineContext) => {

    const GRID_W = grid3d[0].length;//  RESOLUTION * WW;
    const GRID_H = grid3d.length; // RESOLUTION * WH;

    for (let y = 0; y < GRID_H; y++) {
        for (let x = 0; x < GRID_W; x++) {

            if (grid3d[y][x].length > 0) {

                const sectors = getSectorsAsFlatList(grid3d, x, y);

                const len = sectors.length;
                for (let i = 0; i < len; i++) {
                    const a = sectors[i];
                    collider(grid3d, a, sectors, handler, ctx, i);
                }
            }
        }
    }
}


export const Grid3dListCollider = (grid3dA: Imovable[][][], grid3dB: Imovable[][][], handler: CollisionHandler, ctx: EngineContext) => {

    const GRID_W = grid3dA[0].length;//  RESOLUTION * WW;
    const GRID_H = grid3dA.length; // RESOLUTION * WH;

    for (let y = 0; y < GRID_H; y++) {
        for (let x = 0; x < GRID_W; x++) {


            if (grid3dA[y][x].length > 0 && grid3dB[y][x].length > 0) {

                const sectorsA = getSectorsAsFlatListWrapped(grid3dA, x, y);
                const sectorsB = getSectorsAsFlatListWrapped(grid3dB, x, y);
                //console.log(sectorsA.length, sectorsB.length);
                const len = sectorsA.length;

                for (let i = 0; i < len; i++) {

                    const a = sectorsA[i];
                    collider(grid3dA, a, sectorsB, handler, ctx, -1);
                }
            }
        }
    }
}

export const grid3dCollider = (a: Imovable, grid3d: Imovable[][][], handler: CollisionHandler, ctx: EngineContext) => {
    const x = Math.floor(a.pos.x * RESOLUTION);
    const y = Math.floor(a.pos.y * RESOLUTION);

    const sectors = getSectorsAsFlatListWrapped(grid3d, x, y);

    collider(grid3d, a, sectors, handler, ctx);
}


export const grid3dCollider_2 = (a: Imovable, grid3d: Imovable[][][], grid3dLargeRadius: Imovable[][][], handler: CollisionHandler, ctx: EngineContext, currIndex: number = -1) => {
    const x = Math.floor(a.pos.x * RESOLUTION);
    const y = Math.floor(a.pos.y * RESOLUTION);

    const sectors = getSectorsAsFlatListWrapped(grid3d, x, y);

    const additionalSectors = grid3dLargeRadius[y][x];
    if (!additionalSectors) {
        debugger;
    }
    if (additionalSectors.length > 0) {
        collider(grid3d, a, [...sectors, ...additionalSectors], handler, ctx, currIndex);
    } else {
        collider(grid3d, a, sectors, handler, ctx, currIndex);
    }
}



export const grid3dColliderBounce = (a: Imovable, grid3d: Imovable[][][], handler: CollisionHandler, ctx: EngineContext) => {
    const x = Math.floor(a.pos.x * RESOLUTION);
    const y = Math.floor(a.pos.y * RESOLUTION);

    const sectors = getSectorsAsFlatList(grid3d, x, y);

    collider(grid3d, a, sectors, handler, ctx);
}

/*export*/ const collider = (grid3d: Imovable[][][], a: Imovable, list: Imovable[], handler: CollisionHandler, ctx: EngineContext, currIndex: number = -1) => {

    /* const sectorSize = ctx.WW / (ctx.WW * RESOLUTION) * 0.5;
 
     if (a.radius > sectorSize * 2) {
 
         //console.log('fetching more sectors', a.radius);
         // NOTE: if larger item than standard sectorgrid 3x3, get more sectors. TODO: this does not work....
 
         //Maybe it's colliding with itself since it is contained in the new sectors.
 
 
         //must be done earlier,  ship vs big asteroid wont swing.
         list = getSectorsAsFlatListWrapped(grid3d, Math.floor(a.pos.x * RESOLUTION), Math.floor(a.pos.y * RESOLUTION), (a.radius / sectorSize) * 2);
     }*/

    let len = list.length;
    for (let i = 0; i < len; i++) {
        const b = list[i];

        if (i !== currIndex && !a.remove && !b.remove && a.guid !== b.guid) {




            handler(a, b, ctx);
        }
    }
}