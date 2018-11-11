import Game, { Star } from '../../models/Game';
import { EngineContext } from '../Game';


export const init = (ctx: EngineContext) => {

    const { game, WW, WH, SW } = ctx;

    for (let i = 0; i < WH * 0.2; i++) {

        let star: Star = {
            x: Math.random() * WW * 0.4,
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
    const { game, WW, step, SW } = ctx;


    if (time > step * 5) {
        time = 0;

        let star: Star = {
            x: Math.random() * SW,
            alpha: Math.floor(Math.random() * 255)
        }
        game.starMap.shift();
        game.starMap.push(star);
    }
    time += step;
}