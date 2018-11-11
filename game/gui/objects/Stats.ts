import { GuiContext } from "../Game";
import { normalize } from "../../engine/math/Util";


const FPS_LIST: number[] = [];
const FRAME_TIME: number[] = [];
const ENGINE_TIME: number[] = [];
const GUI_TIME: number[] = [];
let oldBarsGUI = [];
let oldBarsEngine = [];
let oldParticles = [];


const drawBars = (ctx: CanvasRenderingContext2D, bars: number[], oldBars: number[], x: number, y: number, r: number, g: number, b: number, a: number) => {

    ctx.strokeStyle = 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
    ctx.lineWidth = 2;
    ctx.beginPath();
    const numBars = bars.length;
    for (let b = 0; b < numBars; b++) {
        const bar = bars[b] * 10 + 1
        const oldBar = oldBars[b] || 100;
        const ret = bar > oldBar ? bar : oldBar > 1 ? oldBar - 1 : oldBar;
        oldBars[b] = ret;
        ctx.moveTo(x, y + b * 5);
        ctx.lineTo(x + 1 + ret, y + b * 5);
    }
    ctx.closePath();
    ctx.stroke();

}

export default (guictx: GuiContext, engineTime: number, guiTime: number) => {
    const { ctx, stepMS, game } = guictx;

    const fps = normalize(1000 / stepMS, FPS_LIST);
    const engine = normalize(engineTime, ENGINE_TIME);
    const gui = normalize(guiTime, GUI_TIME);
    const frame = normalize(stepMS, FRAME_TIME);


    const bars = [frame, gui, engine];

    ctx.font = "20px Lucida Console";
    ctx.fillStyle = 'rgba(0,0,255,255)';
    ctx.fillText("FPS:" + fps.avg + '|' + fps.low, 10, 30);

    ctx.strokeStyle = 'rgba(0,0,255,255)';
    ctx.lineWidth = 2;
    ctx.beginPath();

    let numBars = bars.length;
    for (let b = 0; b < numBars; b++) {
        const bar = bars[b];

        ctx.moveTo(0, 50 + b * 5);
        ctx.lineTo(bar.avg * 10, 50 + b * 5);
    }

    ctx.moveTo((1000 / 60) * 10, 50);
    ctx.lineTo((1000 / 60) * 10, 50 + bars.length * 5);




    ctx.closePath();
    ctx.stroke();

    drawBars(ctx, game.performance.engine, oldBarsEngine, 0, 100, 255, 0, 0, 255);
    const y = game.performance.engine.length * 5 + 100;
    drawBars(ctx, game.performance.gui, oldBarsGUI, 0, y, 255, 255, 255, 255);

    drawBars(ctx, [game.performance.asteroids * 0.01, game.performance.particles * 0.001], oldParticles, 0, 90, 0, 255, 255, 255)



}