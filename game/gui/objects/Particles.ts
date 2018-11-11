import { GuiContext } from '../Game';
import { Particle } from '../../models/Particle';
import { setRGBA, fillRGBA } from '../Buffer';
import { PARTICLE_SPEED_TO_COLOR } from '../../engine/Consts';



export default (guiContext: GuiContext) => {

    const { game, frame, SW, SH, SX, SY } = guiContext;

    let particle: Particle;

    let particles = game.particles;
    let len = particles.length;

    for (let i = 0; i < len; i++) {
        particle = particles[i];

        const x = particle.pos.x - SX;
        const y = particle.pos.y - SY;
        if (x < SW && y < SH && x > 0 && y > 0) {
            setRGBA(SW, x, y, 255, particle.vel.getLength() * 10 * PARTICLE_SPEED_TO_COLOR * 2, 0, 255, frame);
        }
    }



    particles = game.player.thrustParticles;
    len = particles.length;

    for (let i = 0; i < len; i++) {
        particle = particles[i];
        const x = particle.pos.x - SX;
        const y = particle.pos.y - SY;
        if (x < SW && y < SH && x > 0 && y > 0) {
            setRGBA(SW, x, y, 255, particle.vel.getLength() * 10 * PARTICLE_SPEED_TO_COLOR * 2, 0, 255, frame);
        }
    }


    particles = game.player.bullets;
    len = particles.length;

    for (let i = 0; i < len; i++) {
        particle = particles[i];
        const x = particle.pos.x - SX;
        const y = particle.pos.y - SY;
        if (x < SW && y < SH && x > 0 && y > 0) {
            setRGBA(SW, x, y, 0, 255, 255, 255, frame);
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
            const x = particle.pos.x - SX;
            const y = particle.pos.y - SY;
            if (x < SW && y < SH && x > 0 && y > 0) {
                setRGBA(SW, x, y, 0, 255, 255, 255, frame);
            }
        }
    }




    const customParticles = game.customParticles;
    len = customParticles.length;

    for (let i = 0; i < len; i++) {
        const customParticle = customParticles[i];

        const x = customParticle.pos.x - SX;
        const y = customParticle.pos.y - SY;
        const color = customParticle.color;
        if (x < SW && y < SH && x > 0 && y > 0) {
            //setRGBA(SW, x, y, color.r, color.g, color.b, color.a, frame);
            fillRGBA(SW, x, y, 3, 3, color.r, color.g, color.b, color.a, frame);
        }


    }

}