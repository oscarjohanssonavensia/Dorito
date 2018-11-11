import { GuiContext } from "../Game";
import { line2, blockCircleRGBA, onStage } from '../Buffer';
import { ProximityVectors } from '../../models/Ship';
import { Vector } from '../../engine/math/vector';


const drawDetection = (list: ProximityVectors[], origin: Vector, SW: number, SX: number, SY: number, frame: Uint8ClampedArray, r: number, g: number, b: number, a: number) => {
    const len = list.length;
    for (let i = 0; i < len; i++) {
        const proximity = list[i];
        line2(SW, origin.x + proximity.from.x - SX, origin.y + proximity.from.y - SY, origin.x + proximity.to.x - SX, origin.y + proximity.to.y - SY, r, g, b, a, frame, 1);
    }
}

const drawShipTriangle = (layout: Vector[], pos: Vector, SW: number, SX: number, SY: number, frame: Uint8ClampedArray, r: number, g: number, b: number, a: number) => {
    let shipX = pos.x - SX;
    let shipY = pos.y - SY;


    let oldX = shipX + layout[layout.length - 1].x;
    let oldY = shipY + layout[layout.length - 1].y;
    let newX = 0;
    let newY = 0;
    for (let i = 0; i < layout.length; i++) {

        newX = shipX + layout[i].x;
        newY = shipY + layout[i].y;

        line2(SW, oldX, oldY, newX, newY, r, g, b, a, frame, 2);


        oldX = newX;
        oldY = newY;

    }

}

let shieldAngle = Number.MIN_VALUE;

export default (guiContext: GuiContext) => {

    const { game, SX, SY, frame, SW, SH } = guiContext
    let len = 0;

    const player = game.player;


    // DRAW ENEMY SHIPS
    let enemies = game.enemies;
    len = enemies.length;

    for (let e = 0; e < len; e++) {

        const enemy = enemies[e];
        const layout = enemy.rotatedLayout;

        let shipX = enemy.pos.x;
        let shipY = enemy.pos.y;

        if (onStage(guiContext, enemy.pos.x, enemy.pos.y)) {

            drawShipTriangle(layout, enemy.pos, SW, SX, SY, frame, 255, 0, 0, 255);


            if (shipX > SX && shipX < SX + SW && shipY > SY && shipY < SY + SH) {
                line2(SW, shipX - enemy.radius * 0.5 - SX, shipY - enemy.radius * 2 - SY, ((shipX - enemy.radius * 0.5) + enemy.life * 0.3) - SX, shipY - enemy.radius * 2 - SY, 255, 0, 0, 255, frame, 2);

            }
        }
    }


    if (player.life <= 0) {
        return;
    }

    // SHIP TRIANGLE
    drawShipTriangle(player.rotatedLayout, player.pos, SW, SX, SY, frame, 0, 255, 255, 255);


    // CHARGE
    if (player.charge) {
        const charge = player.charge;
        const cx = charge.pos.x;
        const cy = charge.pos.y;

        if (onStage(guiContext, cx, cy)) {

            blockCircleRGBA(8, charge.radius, cx, cy, 0, frame, 255, 0, 0, 255, SW, SH, SX, SY);
            line2(SW, cx - SX - charge.timer * 0.03, cy - SY - 10, cx - SX + charge.timer * 0.03, cy - SY - 10, 255, 0, 0, 255, frame, 2);
        }
    }


    // DETECTION
    drawDetection(player.enemyDetection, player.pos, SW, SX, SY, frame, 255, 0, 0, 255);
    drawDetection(player.asterodDetection, player.pos, SW, SX, SY, frame, 255, 255, 255, 255);
    drawDetection(player.anomalyDetection, player.pos, SW, SX, SY, frame, 0, 255, 0, 255);





    // SHIELDS
    if (player.shields > 0) {
        shieldAngle += 0.01;
        let radiusMulip = 1;
        if (player.shields < 80) {
            shieldAngle += 0.1;
            radiusMulip = Math.random() * 0.15 + 0.85;
        }
        if (player.shields < 5) {
            radiusMulip = Math.random() * 0.2 + 0.6;
        }
        blockCircleRGBA(8, player.radius * 4 * radiusMulip, player.pos.x, player.pos.y, -player.angle + shieldAngle, frame, 255, 0, 255, 255, SW, SH, SX, SY, 1);
    }
}