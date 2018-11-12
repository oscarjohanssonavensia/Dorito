import { GuiContext } from "../Game";
import { line2, blockCircleRGBA, onStage, fillRGBA } from '../Buffer';
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
let targetAngle = Number.MIN_VALUE;

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
        blockCircleRGBA(12, player.radius * 4 * radiusMulip, player.pos.x, player.pos.y, -player.angle + shieldAngle, frame, 255, 0, 255, 255, SW, SH, SX, SY, 1);
    }



    // ELECTRO BASTARD RAY

    line2(SW, player.pos.x - SX - player.electroBastardRayCoolDown * 0.1, player.pos.y - player.radius * 2 - SY, (player.pos.x + player.electroBastardRayCoolDown * 0.1) - SX, player.pos.y - player.radius * 2 - SY, 0, 255, 255, 255, frame, 2);
    if (player.closestItem) {
        const closestItem = player.closestItem;
        targetAngle += 0.02;
        blockCircleRGBA(16, closestItem.radius * 1.2, closestItem.pos.x, closestItem.pos.y, targetAngle, frame, 255, 0, 0, 255, SW, SH, SX, SY, 2, true);

        if (player.electroBastardRay) {

            const ebr = player.closestItem;



            const ebrX = ebr.pos.x;
            const ebrY = ebr.pos.y;

            const shipX = player.rotatedLayoutPositioned[0].x;
            const shipY = player.rotatedLayoutPositioned[0].y;

            const ebrListX: number[] = [shipX - SX];
            const ebrListY: number[] = [shipY - SY];

            const diffX = ebrX - shipX;
            const diffY = ebrY - shipY;

            const len = 10;

            const partialX = diffX / len;
            const partialY = diffY / len;


            for (let i = 1; i < len - 1; i++) {
                ebrListX.push((partialX * (i + 1) + ((Math.random() - 0.5) * partialY)) + shipX - SX);
                ebrListY.push((partialY * (i + 1) + ((Math.random() - 0.5) * partialX)) + shipY - SY);
            }


            ebrListX.push(ebrX - SX);
            ebrListY.push(ebrY - SY);


            const ebrLen = ebrListX.length - 1;
            for (let i = 0; i < ebrLen; i++) {
                const fromX = ebrListX[i];
                const toX = ebrListX[i + 1];
                const fromY = ebrListY[i];
                const toY = ebrListY[i + 1];


                line2(SW, fromX, fromY, toX, toY, 0, 255, 255, 255, frame, 2);
                line2(SW, fromX, fromY, toX, toY, 255, 255, 255, 255, frame, 1);
            }
        }
    }
}