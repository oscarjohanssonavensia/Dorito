import { Vector } from "../engine/math/vector";

type Imovable = {
    pos: Vector;
    vel: Vector;
    radius: number;
    life: number;
    remove?: boolean;
    markNewForColliders: boolean;
    guid: number;
}

export default Imovable;