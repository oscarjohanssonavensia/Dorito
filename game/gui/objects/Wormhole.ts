import { GuiContext } from '../Game';
import { WORM_HOLE_OUT_X, WORM_HOLE_OUT_Y, WORM_HOLE_IN_X, WORM_HOLE_IN_Y, WHITE_HOLE_X, WHITE_HOLE_Y } from '../../engine/Consts';
import { line2, blockCircleRGBA, onStage } from '../Buffer';
import Text from '../text/CreateText';
import { TextBuffer } from '../text/CreateText';
let radiusOut = 200;
let radiusIn = 400;

const BLACK_HOLE_TEXT_BUFFER = Text.create('BLACK_HOLE', 80, 600, 80, 'r');
const WHITE_HOLE_TEXT_BUFFER = Text.create('WHITE_HOLE', 80, 600, 80, 'r');
const ANOMALY_TEXT_BUFFER = Text.create('ANOMALY', 80, 600, 80, 'r');


const drawTexts = (text: TextBuffer, x: number, y: number, guictx: GuiContext) => {
    const { frame, SW, SX, SY } = guictx;
    if (onStage(guictx, x, y)) {

        line2(SW, x - SX, y - SY, x - SX + 200, y - SY - 200, 255, 0, 0, 255, frame, 5);
        Text.addDistorted(SW, frame, text, x - SX + 200, y - SY - 240);
    }

}

export default (guictx: GuiContext) => {
    const { frame, WW, WH, SW, SH, SX, SY } = guictx;

    drawTexts(BLACK_HOLE_TEXT_BUFFER, WORM_HOLE_IN_X * WW, WORM_HOLE_IN_Y * WH, guictx);
    drawTexts(ANOMALY_TEXT_BUFFER, WHITE_HOLE_X * WW, WHITE_HOLE_Y * WH, guictx);
    drawTexts(WHITE_HOLE_TEXT_BUFFER, WORM_HOLE_OUT_X * WW, WORM_HOLE_OUT_Y * WH, guictx);


    if (onStage(guictx, WW * WORM_HOLE_OUT_X, WH * WORM_HOLE_OUT_Y, radiusOut)) {
        blockCircleRGBA(8, radiusOut, WW * WORM_HOLE_OUT_X, WH * WORM_HOLE_OUT_Y, 0, frame, 255, 0, 0, 255, SW, SH, SX, SY);
    }
    if (onStage(guictx, WW * WORM_HOLE_IN_X, WH * WORM_HOLE_IN_Y, 100)) {
        blockCircleRGBA(8, 10 + Math.random() * 50, WW * WORM_HOLE_IN_X, WH * WORM_HOLE_IN_Y, 0, frame, 255, 0, 0, 255, SW, SH, SX, SY);
    }

    radiusOut += 10;
    if (radiusOut > 400) {
        radiusOut = 10;
    }

    radiusIn -= 10;
    if (radiusIn < 10) {
        radiusIn = 400;
    }

}