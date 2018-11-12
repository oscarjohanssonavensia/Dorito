import { Pixel } from '../models/Pixel';
import { doublePI } from '../engine/Consts';
import { GuiContext } from './Game';
import Imovable from '../models/IMovable';


export const setRGBA = (SW: number, x: number, y: number, r: number, g: number, b: number, a: number, data: Uint8ClampedArray) => {

    if (x > SW || x < 0) {
        return;
    }
    //if (y % 2 === 0) {  // mucho performante
    const i = Math.floor(y) * SW * 4 + Math.floor(x) * 4;
    data[i] = r;
    data[i + 1] = g;
    data[i + 2] = b;
    data[i + 3] = a;
    //}
};


export const distort = (SW: number, fromy: number, toy: number, data: Uint8ClampedArray) => {

    let toy_SAFE = Math.floor(toy);
    let fromy_SAFE = Math.floor(fromy);

    const rows = toy_SAFE - fromy_SAFE;

    var shiftPattern: number[] = [];

    for (let i = 0; i < rows; i++) {

        shiftPattern.push(Math.round(((i * -4 * i) * Math.random() * 0.001)) * 4 + 4);
    }

    let rowcounter = 0;

    for (let y = fromy_SAFE; y < toy_SAFE; y += 2) {

        const shift = shiftPattern[rowcounter];
        rowcounter++;

        const rowStart = Math.floor(y) * SW * 4 + 100 * 4;
        const rowEnd = Math.floor(y) * SW * 4 + Math.floor(SW - 100 * 4) * 4;


        //for (let i = rowEnd; i > rowStart; i -= 4) {
        for (let i = rowStart; i < rowEnd; i += 8) {


            data[i + shift] = data[i];
            data[i + 1 + shift] = data[i + 1];
            data[i + 2 + shift] = data[i + 2];
            data[i + 3 + shift] = data[i + 3];

            if (Math.random() > 0.9) {
                data[i + SW] = data[i];
                data[i + 1 + SW] = data[i + 1];
                data[i + 2 + SW] = data[i + 2];
                data[i + 3 + SW] = data[i + 3];
            }

        }
    }


}

export const fillRGBA = (SW: number, x: number, y: number, w: number, h: number, r: number, g: number, b: number, a: number, data: Uint8ClampedArray, offsetX: number = 0, offsetY: number = 0) => {
    for (let dx = 0; dx < w; dx++) {
        for (let dy = 0; dy < h; dy++) {
            setRGBA(SW, x + dx + offsetX, y + dy + offsetY, r, g, b, a, data);
        }
    }
}

export const line2 = (SW: number, fromX: number, fromY: number, toX: number, toY: number, _r: number, _g: number, _b: number, _a: number, data: Uint8ClampedArray, thickness: number = 1) => {

    function line(x0, y0, x1, y1) {
        var dx = Math.abs(x1 - x0);
        var dy = Math.abs(y1 - y0);
        var sx = (x0 < x1) ? 1 : -1;
        var sy = (y0 < y1) ? 1 : -1;
        var err = dx - dy;

        while (true) {
            //setPixel(x0,y0);  // Do what you need to for this
            if (thickness > 1) {
                setRGBA(SW, x0, y0, _r, _g, _b, _a, data);
                for (let i = 0; i < thickness; i++) {
                    setRGBA(SW, x0 + i, y0, _r, _g, _b, _a, data);
                    setRGBA(SW, x0, y0 + i, _r, _g, _b, _a, data);
                }
            } else {

                setRGBA(SW, x0, y0, _r, _g, _b, _a, data);
            }
            if ((x0 == x1) && (y0 == y1)) break;
            var e2 = 2 * err;
            if (e2 > -dy) { err -= dy; x0 += sx; }
            if (e2 < dx) { err += dx; y0 += sy; }
        }
    }

    line(Math.floor(fromX), Math.floor(fromY), Math.floor(toX), Math.floor(toY));
}


export const lineHorizontalRGBADash = (SW: number, fromX: number, fromY: number, toX: number, r: number, g: number, b: number, a: number, data: Uint8ClampedArray, thickness: number = 1, stripLength: number = 0, stripLength2: number = 0, stripOffset: number = 0) => {

    let stripCounter = 0;

    for (let dx = (fromX - stripLength); dx < toX - stripOffset; dx++) {
        stripCounter++;
        if (stripCounter <= stripLength) {
            if (dx + stripOffset > fromX) {
                for (var t = 0; t < thickness; t++) {
                    setRGBA(SW, dx + stripOffset, fromY + t, r, g, b, a, data);
                }
            }
        } else if (stripCounter > stripLength + stripLength2) {
            stripCounter = 0;
        }
    }
}
export const lineVerticalRGBADash = (SW: number, fromX: number, fromY: number, toY: number, r: number, g: number, b: number, a: number, data: Uint8ClampedArray, thickness: number = 1, stripLength: number = 0, stripLength2: number = 0, stripOffset: number = 0) => {
    let stripCounter = 0;

    //for (let dy = fromY; dy < toY; dy++) {
    for (let dy = (fromY - stripLength); dy < toY - stripOffset; dy++) {


        // setRGBA(SW, fromX, dy, r, g, b, a, data);

        stripCounter++;
        if (stripCounter < stripLength) {
            if (dy + stripOffset > fromY) {
                for (var t = 0; t < thickness; t++) {
                    setRGBA(SW, fromX + t, dy + stripOffset, r, g, b, a, data);
                }
            }
        } else if (stripCounter > stripLength + stripLength2) {
            stripCounter = 0;
        }


    }
}

export const blockCircleRGBA = (sides: number, radius: number, posx: number, posy: number, angle: number, frame: Uint8ClampedArray, r: number, g: number, b: number, a: number, SW: number, SH: number = 0, SX: number = 0, SY: number = 0, thickness?: number, skipOdd?: boolean) => {

    let oldX;
    let oldY;
    let newX;
    let newY;
    let j = sides;

    oldX = (posx + Math.cos(doublePI * (j / sides) + angle) * radius) >> 0;
    oldY = (posy + Math.sin(doublePI * (j / sides) + angle) * radius) >> 0;
    newX = 0;
    newY = 0;

    for (j; j > -1; --j) {
        newX = (posx + Math.cos(doublePI * (j / sides) + angle) * radius) >> 0;
        newY = (posy + Math.sin(doublePI * (j / sides) + angle) * radius) >> 0;


        if (!skipOdd || j % 2 == 1) {
            line2(SW, oldX - SX, oldY - SY, newX - SX, newY - SY, r, g, b, a, frame, thickness ? thickness : radius > 40 ? 6 : 2);
        }


        oldX = newX;
        oldY = newY;
    }
}


export const onStage = (guiCtx: GuiContext, x: number, y: number, offset: number = 0): boolean => {
    const { SX, SY, SW, SH } = guiCtx;
    if (x > SX - offset && x < SX + SW + offset && y > SY - offset && y < SY + SH + offset) {
        return true;
    }
    return false;
}