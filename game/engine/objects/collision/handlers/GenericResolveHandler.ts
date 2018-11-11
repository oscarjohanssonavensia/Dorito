import { CollisionHandler } from '../CollisionGrid';
import Imovable from '../../../../models/IMovable';
import { EngineContext } from '../../../Game';
import { resolve } from '../../../math/Collision';
import { shift } from '../../../math/Mapedge';

const genericHandler: CollisionHandler = (a: Imovable, b: Imovable, ctx: EngineContext) => {
    if (resolve(a, b)) {
        shift(a, ctx.WW, ctx.WH);
        shift(b, ctx.WW, ctx.WH);
    }
}

export default genericHandler;