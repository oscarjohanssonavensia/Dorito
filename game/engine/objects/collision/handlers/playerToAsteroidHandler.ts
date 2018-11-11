import { CollisionHandler } from "../../Collisions";
import Imovable from "../../../../models/IMovable";
import { EngineContext } from "../../../Game";
import { distanceBetweenVectors, fine, distanceBetweenXYXY, resolve } from "../../../math/Collision";
import { explosion } from "../../../Create";
import { shift } from '../../../math/Mapedge';

const playerToAsteroidHandler: CollisionHandler = (ship: Imovable, asteroid: Imovable, ctx: EngineContext) => {
  const player = ctx.game.player;
  const rotatedLayoutPositioned = player.rotatedLayoutPositioned;

  if (distanceBetweenVectors(player.pos, asteroid.pos) < player.radius + asteroid.radius) {
    let collided = false;
    if (asteroid.radius < ship.radius) {
      if (fine(rotatedLayoutPositioned.length, rotatedLayoutPositioned, asteroid.pos)) {
        collided = true;
        explosion(ctx.game.forceField, 5, asteroid.pos.x, asteroid.pos.y, ctx.game.particles);
      }
    } else {

      for (let i = 0; i < rotatedLayoutPositioned.length; i++) {
        const shipPoint = rotatedLayoutPositioned[i];
        if (distanceBetweenXYXY(shipPoint.x, shipPoint.y, asteroid.pos.x, asteroid.pos.y) < asteroid.radius) {
          collided = true;
          explosion(ctx.game.forceField, 5, shipPoint.x, shipPoint.y, ctx.game.particles);
          break;

        }
      }

    }
    if (collided) {
      asteroid.life--;
      ship.life--;
      ctx.game.player.damageTaken = true;

      resolve(player, asteroid);

      shift(ship, ctx.WW, ctx.WH);
      shift(asteroid, ctx.WW, ctx.WH);
    }
  }
}

export default playerToAsteroidHandler;