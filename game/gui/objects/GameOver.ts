import { GuiContext } from "../Game";
import { distort } from "../Buffer";
import Text from '../text/CreateText';

const GAME_OVER_BUFFERED_TEXT = Text.create('GAME OVER', 150, 830, 140, 'r');


export default (guictx: GuiContext) => {
    const { ctx, frame, WW, WH, game, SW, SH, SX, SY } = guictx;

    if (game.player.life <= 0) {
        distort(GAME_OVER_BUFFERED_TEXT.w, 0, Math.random() * GAME_OVER_BUFFERED_TEXT.h, GAME_OVER_BUFFERED_TEXT.frame);
        Text.addDistorted(SW, frame, GAME_OVER_BUFFERED_TEXT, 300 + Math.random() * 3, 300 + Math.random() * 2);
    }
}