export class Vector {

    x: number = 0;
    y: number = 0;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(v: Vector) {
        this.x += v.x;
        this.y += v.y;
        // return new Vector(this.x + v.x, this.y + v.y);
    }

    set(x: number, y: number) {
        this.x = x;
        this.y = y;
        // return new Vector(this.x + v.x, this.y + v.y);
    }

    mult(scalar: number) {
        this.x *= scalar;
        this.y *= scalar;
    }

    dot(v: Vector) {
        return this.x * v.x + this.y * v.y;
    }

    normalize(): Vector {
        let norm = this.norm();

        return new Vector(this.x / norm, this.y / norm);
    }

    subtract(v: Vector): Vector {
        return new Vector(this.x - v.x, this.y - v.y);
    }
    norm() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    /*
        copy(): Vector {
            return new Vector(this.x, this.y);
        }
    
    
        distance(v: Vector) {
            return (v.subtract(this)).norm();
        }
    
        mult(scalar: number) {
            return new Vector(this.x * scalar, this.y * scalar);
        }
    
        norm() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
    
        normalize(): Vector {
            let norm = this.norm();
    
            return new Vector(this.x / norm, this.y / norm);
        }
    
        subtract(v: Vector): Vector {
            return new Vector(this.x - v.x, this.y - v.y);
        }
    
        scalarMult(a: number): Vector {
            return new Vector(this.x * a, this.y * a);
        }
    
    
        toString(): string {
            return "(" + this.x + ", " + this.y + ")";
        }
    */
    getLength(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    setLength(length: number) {
        const angle = this.getAngle();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    getAngle(): number {
        return Math.atan2(this.y, this.x);
    }

    setAngle(angle) {
        var length = this.getLength();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }

    rotate(origin: Vector, angle: number) {
        angle = angle * Math.PI / 180.0;

        const originX = origin.x;
        const originY = origin.y;
        const pointX = this.x;
        const pointY = this.y;
        return {
            x: Math.cos(angle) * (pointX - originX) - Math.sin(angle) * (pointY - originY) + originX,
            y: Math.sin(angle) * (pointX - originX) + Math.cos(angle) * (pointY - originY) + originY
        };
    };

}