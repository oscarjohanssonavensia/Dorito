import * as Consts from './Consts'
import { Particle } from '../models/Particle';
import { Vector } from './math/vector';
import ForceField from './objects/ForceField';
import { FORCE_FIELD_RESOLUTION } from './Consts';
import { CustomParticle } from '../models/CustomParticle';
import { getGuid } from './math/Collision';
import Types from '../models/Types';




export const forces = (forceField: Vector[][], posx: number, posy: number, size: number = 10, positive: boolean = true, uniform: boolean = false) => {


    const MAX_FY = forceField.length;
    const MAX_FX = forceField[0].length;


    const doubleSize = size * 2;

    const fy = Math.floor(posy * FORCE_FIELD_RESOLUTION);
    const fx = Math.floor(posx * FORCE_FIELD_RESOLUTION);

    const startx = Math.max(fx - size, 0);
    const starty = Math.max(fy - size, 0);

    const endy = Math.min(MAX_FY, fy + size);
    const endx = Math.min(MAX_FX, fx + size);


    const center = forceField[fy][fx];

    let a = fx - fx - size;
    let b = fy - fy - size;
    const maxdist = Math.sqrt(a * a + b * b)

    for (let y = starty; y < endy; y++) {
        for (let x = startx; x < endx; x++) {
            //forceField[y][x].setLength((size - (x - fx) + size - (y - fy)) * 5);
            const node = forceField[y][x];

            var angleRadians = Math.atan2(fy - y, fx - x);

            a = fx - x;
            b = fy - y;
            const dist = Math.sqrt(a * a + b * b);

            const boxDist = Math.abs(y - fy) + Math.abs(x - fx);



            let multip = 0.02;


            multip = boxDist * 0.01
            /*if (Math.abs(x - fx) < 2 && Math.abs(y - fy) < 2) {
                multip = 0.1;
            }*/

            const newLength = (maxdist - dist) * multip;
            if (node.getLength() < newLength) {
                if (boxDist >= 1) {
                    node.setLength(newLength);

                    if (uniform) {
                        node.setAngle((angleRadians + Math.PI));
                    } else {
                        if (positive) {
                            node.setAngle((angleRadians + Math.PI * 0.9));
                        } else {
                            node.setAngle(angleRadians + (boxDist > 2 ? Math.PI * 0.1 : 0));
                        }
                    }
                }
            }
        }
    }


    //forceField[fy][fx].setLength(100);
}

export const explosion = (forceField: Vector[][], amount: number, x: number, y: number, list: Particle[], velx: number = 0, vely: number = 0, fieldValue: number = 12) => {

    if (amount > 10) {
        forces(forceField, x, y, fieldValue, false, true);
    }

    if (list.length > 5000) {
        return;
    }

    for (let i = 0; i < amount; i++) {
        const np: Particle = {
            type: Types.TYPE_PARTICLE,
            guid: getGuid(),
            // vx: (Math.random() - 0.5) * 100,
            // vy: (Math.random() - 0.5) * 100,
            //sx = (Math.random() - 0.5) * 200;
            life: Math.random() * 100,
            // x: x,
            // y: y,
            radius: 1,
            pos: new Vector(x, y),
            vel: new Vector((Math.random() - 0.5), (Math.random() - 0.5)),
            markNewForColliders: true,
            // s: Math.random() * Consts.PARTICLE_MAX_SPEED,
        }
        np.vel.setLength(Math.random() + 1);
        list.push(np);
    }
    for (let i = 0; i < amount; i++) {
        const np: Particle = {
            type: Types.TYPE_PARTICLE,
            guid: getGuid(),
            /* vx: (Math.random() - 0.5) * 15,
             vy: (Math.random() - 0.5) * 15,
             x: x,
             y: y,*/
            radius: 1,
            life: Math.random() * 50,
            //s: Math.random() - 0.5,

            pos: new Vector(x, y),
            vel: new Vector((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15),
            markNewForColliders: true,
        }
        np.vel.setLength(0.1 * Math.random());
        list.push(np);
    }

    if (amount > 10) {

        for (var l = 0; l < 4; l++) {
            const lines = [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5];


            for (let j = 0; j < lines.length; j += 2) {
                for (let i = 0; i < 80; i++) {
                    const np: Particle = {
                        type: Types.TYPE_PARTICLE,
                        guid: getGuid(),
                        radius: 1,
                        //vx: lines[j] + Math.random() * 0.1,
                        //vy: -lines[j + 1] + Math.random() * 0.1,
                        //x: x,
                        //y: y,
                        life: Math.random() * 130,
                        //s: Math.random() * Consts.PARTICLE_MAX_SPEED,

                        pos: new Vector(x, y),
                        vel: new Vector(lines[j] + Math.random() * 0.1, -lines[j + 1] + Math.random() * 0.1),
                        markNewForColliders: true,
                    };
                    np.vel.setLength(i * 0.1)
                    list.push(np);

                }
            }
        }
    }
}






export const customExplosion = (amount: number, x: number, y: number, r: number, g: number, b: number, a: number, list: CustomParticle[], velx: number = 0, vely: number = 0, fieldValue: number = 6) => {



    if (list.length > 5000) {
        return;
    }

    for (let i = 0; i < amount; i++) {
        const np: CustomParticle = {
            type: Types.TYPE_CUSTOM_PARTICLE,
            guid: getGuid(),
            markNewForColliders: true,
            color: {
                r, g, b, a,
            },
            life: Math.random() * 100,

            radius: 1,
            pos: new Vector(x, y),
            vel: new Vector((Math.random() - 0.5), (Math.random() - 0.5)),


        }
        np.vel.setLength(Math.random() + 1);
        list.push(np);
    }
    for (let i = 0; i < amount; i++) {
        const np: CustomParticle = {
            type: Types.TYPE_CUSTOM_PARTICLE,
            guid: getGuid(),
            markNewForColliders: true,
            color: {
                r, g, b, a,
            },
            radius: 1,
            life: Math.random() * 50,


            pos: new Vector(x, y),
            vel: new Vector((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 15),
        }
        np.vel.setLength(0.1 * Math.random());
        list.push(np);
    }

    if (amount > 10) {

        for (var l = 0; l < 4; l++) {
            const lines = [Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5];


            for (let j = 0; j < lines.length; j += 2) {
                for (let i = 0; i < 80; i++) {
                    const np: CustomParticle = {
                        type: Types.TYPE_CUSTOM_PARTICLE,
                        guid: getGuid(),
                        markNewForColliders: true,
                        color: {
                            r, g, b, a,
                        },
                        radius: 1,

                        life: Math.random() * 130,


                        pos: new Vector(x, y),
                        vel: new Vector(lines[j] + Math.random() * 0.1, -lines[j + 1] + Math.random() * 0.1),
                    };
                    np.vel.setLength(i * 0.1)
                    list.push(np);

                }
            }
        }
    }
}