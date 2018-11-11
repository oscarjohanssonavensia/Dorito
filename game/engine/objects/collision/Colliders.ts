import Imovable from "../../../models/IMovable";
import { CollisionHandler } from "../Collisions";
import { EngineContext } from "../../Game";

export const cleanList = (list: Imovable[], pushlist?: Imovable[]) => {
  const cleaned = pushlist || [];
  const len = list.length;
  for (let i = 0; i < len; i++) {
    const item = list[i];
    if (!item.remove) {
      cleaned.push(item);
    }
  }
  return cleaned;
}


export const singleListCollider = (list: Imovable[], handler: CollisionHandler, ctx: EngineContext) => {
  const len = list.length;
  for (let i = 0; i < len; i++) {
    const a = list[i];
    collider(a, list, handler, ctx, i);
  }
}

export const listCollider = (list: Imovable[], otherList: Imovable[], handler: CollisionHandler, ctx: EngineContext) => {
  const len = list.length;

  for (let i = 0; i < len; i++) {
    const a = list[i];
    collider(a, otherList, handler, ctx, -1);
  }
}

export const collider = (a: Imovable, list: Imovable[], handler: CollisionHandler, ctx: EngineContext, currIndex: number = -1) => {
  let len = list.length;
  for (let i = 0; i < len; i++) {
    const b = list[i];

    if (i !== currIndex && !a.remove && !b.remove) {

      handler(a, b, ctx);
    }
  }
}