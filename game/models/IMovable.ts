import { Vector } from "../engine/math/vector";
import Types from './Types';

type Imovable = {
    pos: Vector;
    vel: Vector;
    radius: number;
    life: number;
    remove?: boolean;
    markNewForColliders: boolean;
    guid: number;
    type: Types;
    targetFlagged?: boolean;
}

export default Imovable;