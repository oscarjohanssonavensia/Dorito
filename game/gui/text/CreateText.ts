import { distort } from '../Buffer';

export type color = 'r' | 'g' | 'b';
export type TextBuffer = {
    frame: Uint8ClampedArray;
    rgbIndex: number;
    w: number;
    h: number;
    length: number;
    debugBgColor: string;

}

export default class Text {

    private static buffer = {};

    //private static CANVAS = document.createElement('canvas');

    private static createOffscreenCanvas(w: number, h: number, debugBgColor: string = null) {
        let offScreenCanvas = document.createElement('canvas');
        offScreenCanvas.width = w;
        offScreenCanvas.height = h;
        const ctx = offScreenCanvas.getContext("2d");
        if (debugBgColor) {
            ctx.fillStyle = debugBgColor;
            ctx.fillRect(0, 0, w, h);
        }
        return ctx;
    }

    public static create(str: string, size: number, w: number, h: number, color: color, debugBgColor: string = null): TextBuffer {

        const SAFE_W = Math.floor(w);
        const SAFE_H = Math.floor(h);

        const cacheKey = str + '_' + size + '_' + SAFE_W + SAFE_H + color + debugBgColor;

        const cached = this.buffer[cacheKey];

        if (cached) {
            return cached;
        }

        let r = 0;
        let g = 0;
        let b = 0;
        let rgbIndex
        switch (color) {
            case 'r':
                r = 255;
                rgbIndex = 0;
                break;
            case 'g':
                g = 255;
                rgbIndex = 1;
                break;
            case 'b':
                b = 255;
                rgbIndex = 2;
                break;
        }

        const ctx = this.createOffscreenCanvas(SAFE_W, SAFE_H, debugBgColor);

        ctx.font = size + "px monospace";
        ctx.fillStyle = 'rgba(' + r + ',' + g + ',' + b + ',255)';
        ctx.fillText(str, 0, size * 0.8);


        const imgData = ctx.getImageData(0, 0, w, h);


        const buffer: TextBuffer = {
            frame: imgData.data,
            rgbIndex,
            w: SAFE_W,
            h: SAFE_H,
            length: imgData.data.length,
            debugBgColor,
        }

        this.buffer[cacheKey] = buffer;

        return buffer;
    }

    public static addList(SW: number, frame: Uint8ClampedArray, textBuffers: TextBuffer[], x: number, y: number, distort: boolean = true) {
        const numBuffers = textBuffers.length;
        let currentX = x;

        if (distort) {
            for (let i = 0; i < numBuffers; i++) {
                const textBuffer = textBuffers[i];
                Text.addDistorted(SW, frame, textBuffer, currentX, y);
                currentX += textBuffer.w;
            }
        } else {
            for (let i = 0; i < numBuffers; i++) {
                const textBuffer = textBuffers[i];
                Text.add(SW, frame, textBuffer, currentX, y);
                currentX += textBuffer.w;
            }
        }

    }

    public static measureBuffers(textBuffers: TextBuffer[]) {
        const numBuffers = textBuffers.length;
        let w = 0;
        for (let i = 0; i < numBuffers; i++) {
            const textBuffer = textBuffers[i];

            w += textBuffer.w;
        }
        return w;
    }

    public static addDistorted(SW: number, frame: Uint8ClampedArray, textBuffer: TextBuffer, x: number, y: number) {
        Text.add(SW, frame, textBuffer, x + Math.random() * 6, y + Math.random() * 6,
            Math.random() > 0.8 ? Math.floor(textBuffer.w * (Math.random() * 0.5 + 0.5)) :
                (Math.random() > 0.8 ? Math.floor(textBuffer.w * (Math.random() * 0.0025 + 0.9975)) : textBuffer.w)
            , Math.random() > 0.8 ? Math.floor(textBuffer.length * Math.random()) : textBuffer.length,
            Math.random() > 0.8 ? Math.floor(textBuffer.length * Math.random() * 0.4) : 0);
    }

    public static add(SW: number, frame: Uint8ClampedArray, textBuffer: TextBuffer, x: number, y: number, w: number = textBuffer.w, len: number = textBuffer.length, begin: number = 0) {

        const src = textBuffer.frame;
        const rgbIndex = textBuffer.rgbIndex;
        const SRCW = w;
        let destIndex = 0;

        let lineIndex = 0;

        if (textBuffer.debugBgColor) {
            for (var i = begin; i < len; i += 4) {

                const ix = Math.floor(y + destIndex) * SW * 4 + Math.floor(x + lineIndex) * 4;
                frame[ix + 0] = src[i + 0];
                frame[ix + 1] = src[i + 1];
                frame[ix + 2] = src[i + 2];
                frame[ix + 3] = src[i + 3];

                if (lineIndex >= SRCW) {
                    destIndex++;
                    lineIndex = 0;
                }
                lineIndex++;
            }
        } else {
            for (var i = begin; i < len; i += 4) {

                const xpos = Math.floor(x + lineIndex);
                if (xpos < SW && xpos > 0) {
                    const ix = Math.floor(y + destIndex) * SW * 4 + xpos * 4;
                    const srcColor = src[i + rgbIndex];
                    if (srcColor) {
                        frame[ix + rgbIndex] = srcColor;
                    }
                }
                if (lineIndex >= SRCW) {
                    destIndex++;
                    lineIndex = 0;
                }
                lineIndex++;
            }
        }

    }

}