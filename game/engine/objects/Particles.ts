import { EngineContext } from '../Game';
import { Particle } from '../../models/Particle';
import { shift as MapedgeShift, check as MapedgeCheck } from '../math/Mapedge';
import Force from '../math/Force';
import { wormhole } from '../math/Force';

export default (ctx: EngineContext) => {

    const { game, step, SW, SH, WW, WH } = ctx;

    let particles = game.particles;
    let len = particles.length;

    let particle: Particle;
    for (let i = 0; i < len; i++) {

        particle = particles[i];

        particle.life--;
        particle.pos.add(particle.vel);
        particle.vel.mult(0.99);

        if (MapedgeCheck(particle, WW, WH) || (particle.life < 0 && particle.vel.getLength() < 1 || Math.random() > 0.98)) {
            particles.splice(i, 1);
            i--;
            len--;
            particle.remove = true;
        } else {
            Force(game.forceField, particle);
            wormhole(particle, WW, WH);
        }
    }

    const customParticles = game.customParticles;
    len = customParticles.length;

    for (let i = 0; i < len; i++) {
        const customParticle = customParticles[i];
        customParticle.life--;
        customParticle.pos.add(customParticle.vel);
        customParticle.vel.mult(0.99);

        if (MapedgeCheck(customParticle, WW, WH) || (customParticle.life < 0 && customParticle.vel.getLength() < 1 || Math.random() > 0.98)) {
            customParticles.splice(i, 1);
            i--;
            len--;
            customParticle.remove = true;
        } else {
            Force(game.forceField, customParticle);
            wormhole(customParticle, WW, WH);
        }

    }


    particles = game.player.thrustParticles;
    len = particles.length;

    for (let i = 0; i < len; i++) {
        particle = particles[i];
        particle.life--;
        particle.pos.add(particle.vel);
        particle.vel.mult(0.99);

        if (MapedgeCheck(particle, WW, WH) || (particle.life < 0 && particle.vel.getLength() < 1 || Math.random() > 0.98)) {
            particles.splice(i, 1);
            i--;
            len--;
            particle.remove = true;
        } else {
            Force(game.forceField, particle);
            wormhole(particle, WW, WH);
        }

    }


    particles = game.player.bullets;
    len = particles.length;

    for (let i = 0; i < len; i++) {
        particle = particles[i];
        particle.life--;
        particle.pos.add(particle.vel);

        if (MapedgeCheck(particle, WW, WH) || (particle.life < 0 && particle.vel.getLength() < 1 || Math.random() > 0.98)) {
            particle.remove = true;
            particles.splice(i, 1);
            i--;
            len--;
        } else {
            Force(game.forceField, particle);
            wormhole(particle, WW, WH);
        }

    }


    const enemies = game.enemies;
    const numEnemies = enemies.length;


    for (let e = 0; e < numEnemies; e++) {
        let enemy = enemies[e];
        particles = enemy.bullets;
        len = particles.length;
        for (let i = 0; i < len; i++) {
            particle = particles[i];
            particle.life--;
            particle.pos.add(particle.vel);


            MapedgeShift(particle, WW, WH);

            if (particle.life < 0) {
                particle.remove = true;
                particles.splice(i, 1);
                i--;
                len--;
            }

        }
    }

}