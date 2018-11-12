import { Vector } from './vector';


export type Normalized = {
    avg: number,
    high: number,
    low: number,
};

export const rotateVector = (v: Vector, angle: number, targetVector: Vector = new Vector(0, 0)) => {
    const x = v.x * Math.cos(angle) - v.y * Math.sin(angle);
    const y = v.y * Math.cos(angle) + v.x * Math.sin(angle);
    targetVector.set(x, y);
    return targetVector;

}

export const normalize = (value: number, list: number[], samples: number = 100): Normalized => {
    let avg = 0;
    let high = Number.MIN_VALUE;
    let low = Number.MAX_VALUE;

    list.push(value);

    let len = list.length;

    if (len > samples) {
        list.shift();
        len--;
    }
    for (let i = 0; i < len; i++) {
        const val = list[i];
        avg += val;
        if (val < low) {
            low = val;
        }
        if (val > high) {
            high = val;
        }
    }

    return {
        avg: Math.round(avg / len),
        high: Math.round(high),
        low: Math.round(low),
    };



}