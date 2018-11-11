import { CollisionHandler } from "../../Collisions";
import Imovable from "../../../../models/IMovable";
import { EngineContext } from "../../../Game";
import { Ship } from "../../../../models/Ship";
import { distanceBetweenVectors, fine } from "../../../math/Collision";
import { explosion } from "../../../Create";

const playerBulletToEnemyHandler: CollisionHandler = (bullet: Imovable, enemy: Imovable, ctx: EngineContext) => {
  const enemyShip = enemy as Ship;
  const rotatedLayoutPositioned = enemyShip.rotatedLayoutPositioned;


  if (distanceBetweenVectors(enemy.pos, bullet.pos) < enemy.radius + bullet.radius) {
    if (fine(rotatedLayoutPositioned.length, rotatedLayoutPositioned, bullet.pos)) {
      explosion(ctx.game.forceField, 9, bullet.pos.x, bullet.pos.y, ctx.game.particles);
      enemy.life--;

      bullet.remove = true;
    }
  }
}

export default playerBulletToEnemyHandler;