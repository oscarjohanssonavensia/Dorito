import { Star } from '../../models/Game';
import { EngineContext } from '../Game';


export const init = (ctx: EngineContext) => {

    const { game, SW, SH } = ctx;

    for (let i = 0; i < SH * 2; i++) {

        let star: Star = {
            x: Math.random() * SW * 2,
            alpha: Math.floor(Math.random() * 255)
        }
        game.starMap.push(star);
    }
}

export const resize = (ctx: EngineContext) => {
    ctx.game.starMap = [];
    init(ctx);
}

let time = 0;

export default (ctx: EngineContext) => {
    const { game, step, SW } = ctx;


    if (time > step * 5) {
        time = 0;

        let star: Star = {
            x: Math.random() * SW * 2,
            alpha: Math.random() * 255,
        }
        game.starMap.shift();
        game.starMap.push(star);
    }
    time += step;
}