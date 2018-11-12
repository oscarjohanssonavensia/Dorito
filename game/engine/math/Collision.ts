import { Vector } from './vector';
import Imovable from '../../models/IMovable';




let GUID = 0;

export const getGuid = () => {
    GUID++;
    return GUID;
}

export const fineOld = (nvert: number, vertx: number[], verty: number[], testx: number, testy: number): boolean => {

    let i = 0;
    let j = 0;
    let c: boolean;;

    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
        if (((verty[i] > testy) != (verty[j] > testy)) &&
            (testx < (vertx[j] - vertx[i]) * (testy - verty[i]) / (verty[j] - verty[i]) + vertx[i]))
            c = !c;
    }
    return c;
}



export const fine = (nvert: number, shape: Vector[], test: Vector): boolean => {

    let i = 0;
    let j = 0;
    let c: boolean;;

    for (i = 0, j = nvert - 1; i < nvert; j = i++) {
        if (((shape[i].y > test.y) != (shape[j].y > test.y)) &&
            (test.x < (shape[j].x - shape[i].x) * (test.y - shape[i].y) / (shape[j].y - shape[i].y) + shape[i].x))
            c = !c;
    }
    return c;
}

export const coarse = (a: Imovable, b: Imovable): boolean => {

    //if(a.pos.x + a.radius  )
    const area = a.radius + b.radius;
    const w = a.pos.x - b.pos.x;
    const h = a.pos.y - b.pos.y;

    if (area > Math.sqrt((w * w) + (h * h))) {
        return true;
    }
    return false;
}

export const coarseVecotr = (a: Vector, aRadius: number, b: Vector, bRadius: number): boolean => {

    //if(a.pos.x + a.radius  )
    const area = aRadius + bRadius;
    const w = a.x - b.x;
    const h = a.y - b.y;

    if (area > Math.sqrt((w * w) + (h * h))) {
        return true;
    }
    return false;
}

export const distanceBetween = (a: Imovable, b: Imovable): number => {
    // const area = a.radius + b.radius; TODO: we should use this, ...
    const w = a.pos.x - b.pos.x;
    const h = a.pos.y - b.pos.y;

    return Math.sqrt((w * w) + (h * h));

}

export const midpoint = (a: Vector, b: Vector, multip: number = 0.5) => {

    return new Vector(a.x + (b.x - a.x) * multip, a.y + (b.y - a.y) * multip);
}

export const distanceBetweenXYXY = (ax: number, ay: number, bx: number, by: number) => {
    const w = ax - bx;
    const h = ay - by;
    return Math.sqrt((w * w) + (h * h));
}
export const distanceBetweenVectors = (a: Vector, b: Vector) => {
    const w = a.x - b.x;
    const h = a.y - b.y;
    return Math.sqrt((w * w) + (h * h));
}




const ellastic2DCollistionD = (obj1: Imovable, obj2: Imovable, v1: number, v2: number, d1: number, d2: number, cDir: number, m1: number, m2: number) => {

    const mm = m1 - m2;
    const mmt = m1 + m2;
    const v1s = v1 * Math.sin(d1 - cDir);

    const cp = Math.cos(cDir);
    const sp = Math.sin(cDir);
    var cdp1 = v1 * Math.cos(d1 - cDir);
    var cdp2 = v2 * Math.cos(d2 - cDir);
    const cpp = Math.cos(cDir + Math.PI / 2)
    const spp = Math.sin(cDir + Math.PI / 2)

    var t = (cdp1 * mm + 2 * m2 * cdp2) / mmt;
    obj1.vel.x = t * cp + v1s * cpp;
    obj1.vel.y = t * sp + v1s * spp;
    cDir += Math.PI;
    const v2s = v2 * Math.sin(d2 - cDir);
    cdp1 = v1 * Math.cos(d1 - cDir);
    cdp2 = v2 * Math.cos(d2 - cDir);
    t = (cdp2 * -mm + 2 * m1 * cdp1) / mmt;
    obj2.vel.x = t * -cp + v2s * -cpp;
    obj2.vel.y = t * -sp + v2s * -spp;
}


export const resolve = (a: Imovable, b: Imovable, aRadius: number = a.radius, bRadius: number = b.radius): boolean => {




    // note I am using javascript.
    // b1,b2 are the two balls or circles
    // a.vel.x,a.vel.y are velocity (deltas) to save space same for b2


    // get dist between them
    // first vect from one to the next
    const dx = b.pos.x - a.pos.x;
    const dy = b.pos.y - a.pos.y;



    // then distance
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist === 0) {
        a.pos.x += b.radius;
        a.pos.y += b.radius;
        return true; //ish
    }

    // then check overlap
    if (aRadius + bRadius >= dist) { // the balls overlap
        // normalise the vector between them
        const nx = dx / dist;
        const ny = dy / dist;

        // now move each ball away from each other 
        // along the same line as the line between them
        // Use the ratio of the radius to work out where they touch
        const touchDistFromB1 = (dist * (aRadius / (aRadius + bRadius)))
        const contactX = a.pos.x + nx * touchDistFromB1;
        const contactY = a.pos.y + ny * touchDistFromB1;

        // now move each ball so that they just touch
        // move b1 back
        a.pos.x = contactX - nx * aRadius;
        a.pos.y = contactY - ny * aRadius;

        // and b2 in the other direction
        b.pos.x = contactX + nx * bRadius;
        b.pos.y = contactY + ny * bRadius;


        // from contact test for b1 is immovable
        if (aRadius + bRadius >= dist) { // the balls overlap
            // normalise the vector between them
            const nx = dx / dist;
            const ny = dy / dist;

            // move b2 away from b1 along the contact line the distance of the radius summed
            b.pos.x = a.pos.x + nx * (aRadius + bRadius);
            b.pos.y = a.pos.y + ny * (aRadius + bRadius);

        }


        // get the direction and velocity of each ball
        const v1 = Math.sqrt(a.vel.x * a.vel.x + a.vel.y * a.vel.y);
        const v2 = Math.sqrt(b.vel.x * b.vel.x + b.vel.y * b.vel.y);

        // get the direction of travel of each ball
        const d1 = Math.atan2(a.vel.y, a.vel.x);
        const d2 = Math.atan2(b.vel.y, b.vel.x);

        // get the direction from ball1 center to ball2 cenet
        const directOfContact = Math.atan2(ny, nx);

        // You will also need a mass. You could use the area of a circle, or the
        // volume of a sphere to get the mass of each ball with its radius
        // this will make them react more realistically
        // An approximation is good as it is the ratio not the mass that is important
        // Thus ball are spheres. Volume is the cubed radius
        const mass1 = Math.pow(aRadius, 3);
        const mass2 = Math.pow(bRadius, 3);

        ellastic2DCollistionD(a, b, v1, v2, d1, d2, directOfContact, mass1, mass2);


        a.pos.x += a.vel.x;
        a.pos.y += a.vel.y;
        b.pos.x += b.vel.x;
        b.pos.y += b.vel.y;


        const friction = 0.98;
        a.vel.x *= friction;
        a.vel.y *= friction;
        b.vel.x *= friction;
        b.vel.y *= friction;



        return true;
    }
    return false;
}

export const resolve_old = (a: Imovable, b: Imovable, aRadius: number = a.radius, bRadius: number = b.radius): boolean => {




    const area = aRadius + bRadius;
    const w = a.pos.x - b.pos.x;
    const h = a.pos.y - b.pos.y;


    const sqrt = Math.sqrt((w * w) + (h * h));

    if (area > sqrt) {

        const dist = area - sqrt;


        var massA: number = aRadius * aRadius * Math.PI;
        var massB: number = bRadius * aRadius * Math.PI;



        var velXA: number = a.vel.x;
        var velYA: number = a.vel.y;

        var velXB: number = b.vel.x;
        var velYB: number = b.vel.y;
        /*
                var newVelXA: number = (velXA * (massA - massB) + (2 * massB * velXB)) / (massA + massB);
                var newVelYA: number = (velYA * (massA - massB) + (2 * massB * velYB)) / (massA + massB);
        
                var newVelXB: number = (velXB * (massB - massA) + (2 * massA * velXA)) / (massA + massB);
                var newVelYB: number = (velYB * (massB - massA) + (2 * massA * velYA)) / (massA + massB);
        */

        var newVelXA: number = (velXA * (massA - massB) + (2 * massB * velXB)) / (massA + massB);
        var newVelYA: number = (velYA * (massA - massB) + (2 * massB * velYB)) / (massA + massB);

        var newVelXB: number = (velXB * (massB - massA) + (2 * massA * velXA)) / (massA + massB);
        var newVelYB: number = (velYB * (massB - massA) + (2 * massA * velYA)) / (massA + massB);


        var s: number = 0 / 20;

        a.vel.x = newVelXA;
        a.vel.y = newVelYA;

        b.vel.x = newVelXB;
        b.vel.y = newVelYB;

        const collisionAngleRadians = Math.atan2(a.pos.y - b.pos.y, a.pos.x - b.pos.x);

        a.vel.setAngle(collisionAngleRadians)
        b.vel.setAngle(collisionAngleRadians - Math.PI)

        a.pos.add(a.vel);
        b.pos.add(b.vel);

        a.vel.mult(0.8); //untested
        b.vel.mult(0.8); //untested

        if (coarse(a, b)) {
            if (Math.random() > 0.5) {
                a.pos.x += Math.random() > 0.5 ? dist : -dist;
            } else {
                a.pos.y += Math.random() > 0.5 ? dist : -dist;
            }
        }

        return true;
    }
    return false;
}

