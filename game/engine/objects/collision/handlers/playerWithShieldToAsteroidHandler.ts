import { CollisionHandler } from "../../Collisions";
import Imovable from "../../../../models/IMovable";
import { EngineContext } from "../../../Game";
import { resolve } from "../../../math/Collision";
import { shift } from "../../../math/Mapedge";

const playerWithShieldToAsteroidHandler: CollisionHandler = (ship: Imovable, asteroid: Imovable, ctx: EngineContext) => {
  if (resolve(ship, asteroid, ctx.game.player.radius * 4)) {
    shift(ship, ctx.WW, ctx.WH);
    shift(asteroid, ctx.WW, ctx.WH);
    asteroid.life -= 20;
  }
}

export default playerWithShieldToAsteroidHandler;