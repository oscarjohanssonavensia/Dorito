import { GuiContext } from "../Game";
import { distort } from "../Buffer";
import { MAP_SAFETY_ZONE, GAME_INTRO_TIMER } from '../../engine/Consts';




let damageTaken = 0;
let initGame = GAME_INTRO_TIMER;

export default (guictx: GuiContext) => {
    const { ctx, frame, WW, WH, game, SW, SH, SX, SY } = guictx;

    initGame--;


    const safeZone = MAP_SAFETY_ZONE * 1.5;
    const pos = game.player.pos;
    const dangerZone = (pos.x > WW - safeZone || pos.x < safeZone || pos.y > WH - safeZone || pos.y < safeZone);

    if (guictx.game.player.damageTaken) {
        damageTaken = 10;
    }
    if (damageTaken > 0 || dangerZone || game.player.life < 1 || initGame > -30) {
        damageTaken--;
        distort(SW, 0, Math.random() * SH, frame);
    }
}