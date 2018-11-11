import { GuiContext } from "../../gui/Game";
import { EngineContext } from '../Game';

interface GameUpdater {
    (ctx: GuiContext | EngineContext): void;
}

export default (updater: GameUpdater, ctx: GuiContext | EngineContext, engine: boolean) => {

    const t = performance.now();
    updater(ctx);
    const res = performance.now() - t;

    if (engine) {
        ctx.game.performance.engine.push(res);
    } else {
        ctx.game.performance.gui.push(res);
    }
}

export const MeasureTimeFn = (fn: Function, targetList?: number[]): number => {
    const t = performance.now();
    fn();
    const res = performance.now() - t;
    if (targetList) {
        targetList.push(res);
    }
    return res;
}
