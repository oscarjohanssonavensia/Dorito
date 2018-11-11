import { CollisionHandler } from "../../Collisions";
import Imovable from "../../../../models/IMovable";
import { EngineContext } from "../../../Game";
import { Ship } from "../../../../models/Ship";
import { coarse, fine, resolve } from "../../../math/Collision";
import { explosion } from "../../../Create";
import { shift } from '../../../math/Mapedge';

const playerToEnemyHandler: CollisionHandler = (player: Imovable, enemy: Imovable, ctx: EngineContext) => {
  const playerShip = player as Ship;
  const enemyShip = enemy as Ship;


  if (coarse(playerShip, enemyShip)) {

    const rotatedLayoutPositioned = enemyShip.rotatedLayoutPositioned;

    for (let i = 0; i < rotatedLayoutPositioned.length; i++) {
      const enemyShipPoint = rotatedLayoutPositioned[i];
      if (fine(playerShip.rotatedLayoutPositioned.length, playerShip.rotatedLayoutPositioned, enemyShipPoint)) {
        if (resolve(player, enemy)) {

          shift(player, ctx.WW, ctx.WH);
          shift(enemy, ctx.WW, ctx.WH);

          playerShip.life--;
          playerShip.damageTaken = true;
          enemyShip.life--;
          explosion(ctx.game.forceField, 9, enemyShipPoint.x, enemyShipPoint.y, ctx.game.particles);
        }
      }
    }
  }
}

export default playerToEnemyHandler;