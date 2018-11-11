import Imovable from '../../models/IMovable';

export const shift = (item: Imovable, WW: number, WH: number, minW: number = 1, minH: number = 1) => {
    if (item.pos.x >= WW) {
        item.pos.x = minW;
    } else if (item.pos.x <= minW) {
        item.pos.x = WW - minH;
    }

    if (item.pos.y >= WH) {
        item.pos.y = minH;
    } else if (item.pos.y <= minH) {
        item.pos.y = WH - minH;
    }
}

export const bounce = (item: Imovable, WW: number, WH: number) => {


    const bounceFriction = -0.5;
    const correction = item.radius + 1;
    const floorOffset = 0;
    let bounced = false;

    if (item.pos.x >= WW) {
        item.pos.x = WW - correction;
        item.vel.x *= bounceFriction
        bounced = true;
    } else if (item.pos.x <= 0) {
        item.pos.x = correction;
        item.vel.x *= bounceFriction;
        bounced = true;
    }

    if (item.pos.y + floorOffset >= WH) {
        item.pos.y = WH - (correction + floorOffset);
        item.vel.y *= bounceFriction;
        item.vel.x *= -bounceFriction;
        bounced = true;

    } else if (item.pos.y <= 0) {
        item.pos.y = correction;
        item.vel.y *= bounceFriction;
        bounced = true;
    }
    return bounced;


}


export const check = (item: Imovable, WW: number, WH: number, minW: number = 1, minH: number = 1): boolean => {
    if (item.pos.x >= WW) {
        return true;
    } else if (item.pos.x <= minW) {
        return true;
    }

    if (item.pos.y >= WH) {
        return true;
    } else if (item.pos.y <= minH) {
        return true;
    }
    return false;
}