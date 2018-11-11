import { CollisionHandler } from "../../Collisions";
import Imovable from "../../../../models/IMovable";
import { EngineContext } from "../../../Game";
import { distanceBetweenVectors, fine } from "../../../math/Collision";
import { explosion } from "../../../Create";
import { shift } from '../../../math/Mapedge';

const playerToEnemyBulletHandler: CollisionHandler = (ship: Imovable, bullet: Imovable, ctx: EngineContext) => {
  const player = ctx.game.player;
  const rotatedLayoutPositioned = player.rotatedLayoutPositioned;

  if (distanceBetweenVectors(player.pos, bullet.pos) < player.radius + bullet.radius) {
    if (fine(rotatedLayoutPositioned.length, rotatedLayoutPositioned, bullet.pos)) {
      explosion(ctx.game.forceField, 9, bullet.pos.x, bullet.pos.y, ctx.game.particles);

      shift(ship, ctx.WW, ctx.WH);
      shift(bullet, ctx.WW, ctx.WH);

      ship.life--;
      bullet.remove = true;
      ctx.game.player.damageTaken = true;
    }
  }
}

export default playerToEnemyBulletHandler;