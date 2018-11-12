import { GuiContext } from "../Game";
import { blockCircleRGBA, onStage, line2, fillRGBA } from '../Buffer';
import Text from '../text/CreateText';
import Imovable from '../../models/IMovable';
import { EngineContext } from '../../engine/Game';
import { explosion } from '../../engine/Create';
import { Vector } from '../../engine/math/vector';
import Asteroid from '../../models/Asteroid';
import { getGuid } from '../../engine/math/Collision';
import { Ship } from '../../models/Ship';
import Types from '../../models/Types';
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





    const asteroidParts = guictx.game.asteroidParts;
    const partColor = 180;
    for (let i = 0; i < asteroidParts.length; i++) {
        var ap = asteroidParts[i];
        if (onStage(guictx, ap.pos.x, ap.pos.y, ap.radius)) {
            /*fillRGBA(SW, ap.pos.x - SX, ap.pos.y - SY, 5, 5, 255, 255, 255, 255, frame);
            fillRGBA(SW, ap.edgeA.x - SX, ap.edgeA.y - SY, 5, 5, 255, 255, 255, 255, frame);
            fillRGBA(SW, ap.edgeB.x - SX, ap.edgeB.y - SY, 5, 5, 255, 255, 255, 255, frame);*/

            line2(SW, ap.pos.x + ap.rotatedEdgeA.x - SX, ap.pos.y + ap.rotatedEdgeA.y - SY, ap.pos.x + ap.rotatedEdgeB.x - SX, ap.pos.y + ap.rotatedEdgeB.y - SY, partColor, partColor, partColor, partColor, frame, 2);
        }
    }
}