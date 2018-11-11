import initialization, { start, createAsteroid, SW_init as SW, SH_init as SH } from "../init/initialization";

export default class Startup {

    public static main() {

        const game = initialization();
        game.testMode = true;
        game.player.pos.x = SW * 0.5;
        game.player.pos.y = SH * 0.5;


        createAsteroid(SW * 0.5, SH * 0.8, 0, 0, 30);
        createAsteroid(SW * 0.5, SH * 0.8, 0, 0, 30);
        createAsteroid(SW * 0.1, SH * 0.15, 2, 0, 40);
        createAsteroid(SW * 0.9, SH * 0.1, -2, 0, 20);

        createAsteroid(SW * 0.1, SH * 0.3, 2, 0, 60);
        createAsteroid(SW * 0.9, SH * 0.35, -2, 0, 10);
        createAsteroid(SW * 0.52, SH * 0.82, 0, 0, 30);

        createAsteroid(SW * 0.9, SH * 0.48, -4, 0, 5);
        createAsteroid(SW * 0.9, SH * 0.5, -8, 0, 5);
        createAsteroid(SW * 0.9, SH * 0.53, -12, 0, 5);
        createAsteroid(SW * 0.9, SH * 0.55, -16, 0, 5);

        createAsteroid(SW * 0.2, SH * 0.48, 4, 0, 5);
        createAsteroid(SW * 0.2, SH * 0.5, 8, 0, 5);
        createAsteroid(SW * 0.2, SH * 0.53, 12, 0, 5);
        createAsteroid(SW * 0.2, SH * 0.55, 16, 0, 5);
        createAsteroid(SW * 0, SH * 0.55, 16, 0, 50);

        createAsteroid(SW * 0.9, SH * 0.8, -12, 0, 30);
        createAsteroid(SW * 0.9, SH * 0.9, -8, 0, 30);
        createAsteroid(SW * 0.1, SH * 0.9, 0, 0, 90);

        for (let i = 0; i < SH * 0.05; i++) {
            createAsteroid(SW * 1 + i, i * 50, -5, 0, 5);
        }

        for (let i = 0; i < SH * 0.1; i++) {
            createAsteroid(SW * 1 + i + 600, i * 10, -4, 0, 5);
        }

        createAsteroid(SW + SW, SH * 0.5, -4, 0, 400);

        setTimeout(() => {
            start();
        }, 2000)
    }
}


Startup.main();