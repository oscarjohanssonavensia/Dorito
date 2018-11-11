import { GuiContext } from '../Game';
import { fillRGBA, onStage, line2 } from '../Buffer';
import { RESOLUTION } from '../../engine/objects/collision/Grid3dMapper';
import Text from '../text/CreateText';

let logged = false;
export default (guictx: GuiContext) => {
    const { ctx, frame, WW, WH, game, SW, SH, SX, SY } = guictx;


    const forceField = game.forceField;

    let width = forceField[0].length;
    let height = forceField.length;

    const multipX = WW / width;
    const multipY = WH / height;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let node = forceField[y][x];

            const posX = x * multipX;
            const posY = y * multipY;


            if (onStage(guictx, posX, posY)) {
                line2(SW, posX - SX, posY - SY, node.x * 100 + posX - SX, node.y * 100 + posY - SY, 255, 0, 255, 255, frame);
            }
        }
    }

    if (game.debug) {

        if (!logged) {
            console.log('grid size:', (game.debug as any).length)
            logged = true;
        }

        const asteroidsGrid = (game.debug as any).asteroids;
        const enemyBulletsGrid = (game.debug as any).enemyBullets;
        const enemiesGrid = (game.debug as any).enemies;
        const playerBulletsGrid = (game.debug as any).playerBullets;
        const increasedSectors = (game.debug as any).increasedSectors;

        const grids = [asteroidsGrid, enemiesGrid, enemyBulletsGrid, playerBulletsGrid, increasedSectors];
        const gridsType = ['A', 'E', 'EB', 'PB', 'iS'];
        const numGrids = grids.length;
        width = WW * RESOLUTION;
        height = WH * RESOLUTION;
        const size = (WW / width) * 0.1;
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {

                const xpos = x / RESOLUTION;
                const ypos = y / RESOLUTION;

                if (onStage(guictx, xpos, ypos, size)) {
                    line2(SW, xpos - size - SX, ypos - SY, xpos + size - SX, ypos - SY, 255, 0, 0, 255, frame);
                    line2(SW, xpos - SX, ypos - size - SY, xpos - SX, ypos + size - SY, 255, 0, 0, 255, frame);

                    const sectorIdBuffer = Text.create('Y:' + y + ' X:' + x, 15, 140, 15, 'r');
                    Text.add(SW, frame, sectorIdBuffer, 10 + xpos - SX, 10 + ypos - SY);

                    for (let i = 0; i < numGrids; i++) {
                        const grid = grids[i];
                        if (grid && grid[y] && grid[y][x]) {
                            const sectorsSize = grid[y][x].length;
                            if (sectorsSize) {
                                const tBuffer = Text.create(gridsType[i] + sectorsSize, 30, 100, 30, 'r');
                                Text.add(SW, frame, tBuffer, 10 + xpos - SX, 10 + ypos - SY + (i + 1) * 30);
                            }
                        }

                    }


                }
            }
        }
    }


}