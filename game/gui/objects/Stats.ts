import { GuiContext } from "../Game";
import { normalize } from "../../engine/math/Util";
import { line2 } from '../Buffer';
import Text from '../text/CreateText';

const FPS_LIST: number[] = [];
const FRAME_TIME: number[] = [];
const ENGINE_TIME: number[] = [];
const GUI_TIME: number[] = [];
let oldBarsGUI = [];
let oldBarsEngine = [];
let oldParticles = [];



const drawBars = (frame: Uint8ClampedArray, SW: number, bars: number[], oldBars: number[], x: number, y: number, r: number, g: number, b: number, a: number) => {

    const numBars = bars.length;
    for (let bb = 0; bb < numBars; bb++) {
        const bar = bars[bb] * 10 + 1
        const oldBar = oldBars[bb] || 100;
        const ret = bar > oldBar ? bar : oldBar > 1 ? oldBar - 1 : oldBar;
        oldBars[bb] = ret;

        line2(SW, x, y + bb * 5, x + 1 + ret, y + bb * 5, r, g, b, a, frame, 2);
    }
}

const TEXT_SIZE = 26;
const TEXT_BUFFER_FPS = Text.create('FPS:', TEXT_SIZE, 'r');
const TEXT_BUFFER_SEPARATOR = Text.create('|', TEXT_SIZE, 'r');


export default (guictx: GuiContext, engineTime: number, guiTime: number) => {
    const { ctx, stepMS, game, frame, SW, } = guictx;

    const fps = normalize(1000 / stepMS, FPS_LIST);
    const engine = normalize(engineTime, ENGINE_TIME);
    const gui = normalize(guiTime, GUI_TIME);
    const renderFrame = normalize(stepMS, FRAME_TIME);


    const bars = [renderFrame, gui, engine];

    const textBufferFpsAvg = Text.create(fps.avg + '', TEXT_SIZE, 'r');
    const textBufferFpsLow = Text.create(fps.low + '', TEXT_SIZE, 'r');

    Text.addList(SW, frame, [TEXT_BUFFER_FPS, textBufferFpsAvg, TEXT_BUFFER_SEPARATOR, textBufferFpsLow], 10, 10);

    // AVG and min bars
    const yOffset = 40;
    let numBars = bars.length;
    for (let b = 0; b < numBars; b++) {
        const bar = bars[b];
        line2(SW, 0, yOffset + b * 3, bar.avg * 10, yOffset + b * 3, 255, 0, 0, 255, frame, 2);
    }
    const targetFPS = 1000 / 50;
    line2(SW, targetFPS * 10, yOffset, targetFPS * 10, yOffset + bars.length * 3, 255, 0, 0, 255, frame, 2);


    // FPS graph

    const numFps = FPS_LIST.length;
    for (let i = 0; i < numFps; i++) {
        const fps = FPS_LIST[i] * 0.5;
        line2(SW, 2 + i * 2, 85, 2 + i * 2, 85 - fps, 255 - fps, 0, 0, 255, frame);
    }


    // Engine and GUI stats
    drawBars(frame, SW, game.performance.engine, oldBarsEngine, 0, 100, 255, 0, 0, 255);
    const y = game.performance.engine.length * 5 + 100;
    drawBars(frame, SW, game.performance.gui, oldBarsGUI, 0, y, 255, 255, 255, 255);

    drawBars(frame, SW, [game.performance.asteroids * 0.01, game.performance.particles * 0.001], oldParticles, 0, 90, 0, 255, 255, 255)



}