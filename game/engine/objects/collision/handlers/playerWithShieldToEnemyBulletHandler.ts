import { CollisionHandler } from "../../Collisions";
import Imovable from "../../../../models/IMovable";
import { EngineContext } from "../../../Game";
import { resolve } from "../../../math/Collision";
import { explosion } from "../../../Create";
import { shift } from '../../../math/Mapedge';

const playerWithShieldToEnemyBulletHandler: CollisionHandler = (ship: Imovable, bullet: Imovable, ctx: EngineContext) => {
  if (resolve(ship, bullet, ctx.game.player.radius * 4)) {

    shift(ship, ctx.WW, ctx.WH);
    shift(bullet, ctx.WW, ctx.WH);
    explosion(ctx.game.forceField, 3, bullet.pos.x, bullet.pos.y, ctx.game.particles);
  }
}

export default playerWithShieldToEnemyBulletHandler;