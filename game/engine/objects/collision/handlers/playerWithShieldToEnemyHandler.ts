import { CollisionHandler } from "../../Collisions";
import Imovable from "../../../../models/IMovable";
import { EngineContext } from "../../../Game";
import { resolve } from "../../../math/Collision";
import { explosion } from "../../../Create";
import { shift } from '../../../math/Mapedge';

const playerWithShieldToEnemyHandler: CollisionHandler = (ship: Imovable, enemy: Imovable, ctx: EngineContext) => {
  if (resolve(ship, enemy, ctx.game.player.radius * 4)) {
    shift(ship, ctx.WW, ctx.WH);
    shift(enemy, ctx.WW, ctx.WH);

    explosion(ctx.game.forceField, 3, enemy.pos.x, enemy.pos.y, ctx.game.particles);
  }
}

export default playerWithShieldToEnemyHandler;