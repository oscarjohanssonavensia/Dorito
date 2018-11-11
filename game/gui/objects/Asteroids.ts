import { GuiContext } from "../Game";
import { blockCircleRGBA, onStage } from '../Buffer';
import Text from '../text/CreateText';



export default (guictx: GuiContext) => {
    const { ctx, frame, WW, WH, game, SW, SH, SX, SY } = guictx;

    const asteroids = guictx.game.asteroids;




    for (let i = 0; i < asteroids.length; i++) {
        var a = asteroids[i];
        if (onStage(guictx, a.pos.x, a.pos.y, a.radius)) {
            //const radius = a.life < a.radius ? a.radius + (Math.random() - 0.5) * a.radius * 0.4 : a.radius;
            blockCircleRGBA(a.sides, a.radius, a.pos.x, a.pos.y, a.angle, frame, 255, 255, 255, 255, SW, SH, SX, SY);
            const BUFFER = Text.create(Math.floor(a.life) + '', 20, 'r')
            Text.add(SW, frame, BUFFER, a.pos.x - SX, a.pos.y - SY);
        }
    }
}