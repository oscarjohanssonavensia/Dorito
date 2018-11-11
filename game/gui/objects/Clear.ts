
import { GuiContext } from '../Game';



const OPACITY = 20;
let odd = false;
const LINE_SKIP_MAX = 1;
let lineSkip = LINE_SKIP_MAX;

const clear = (frame: Uint8ClampedArray, start: number, step: number, blur: boolean) => {
    const len = frame.length;

    if (blur) {
        for (var i = start; i < len; i += step) {
            frame[i] = frame[i] - OPACITY;
            frame[i + 1] = frame[i + 1] - OPACITY;
            frame[i + 2] = frame[i + 2] - OPACITY;
            frame[i + 3] = 255;
        }
    } else {
        for (var i = start; i < len; i += step) {
            frame[i] = 0;
            frame[i + 1] = 0;
            frame[i + 2] = 0;
            frame[i + 3] = 255;
        }
    }
}
export default (guiContext: GuiContext) => {
    const { frame, WW, WH, SW, SH } = guiContext;
    const len = frame.length;

    clear(frame, lineSkip * 4, LINE_SKIP_MAX * 4, true);

    lineSkip--;
    if (lineSkip < 0) {
        lineSkip = LINE_SKIP_MAX;
    }
}

export const ClearHard = (guiContext: GuiContext) => {
    const { frame, SW, SH } = guiContext;
    const len = SW * SH * 4;
    const step = 4;
    for (var i = 0; i < len; i += step) {
        frame[i] = 0;
        frame[i + 1] = 0;
        frame[i + 2] = 0;
        frame[i + 3] = 255;
    }
}