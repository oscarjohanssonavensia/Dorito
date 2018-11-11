
import { GuiContext } from '../Game';
import { setRGBA } from '../Buffer';

export default (guiContext: GuiContext) => {

    const { SW, frame, SX, SY, WW, WH, SH, game } = guiContext;

    const multip = SW / WW;

    const translatedX = (WW - SX) * multip;
    const translatedY = (WH - SY) * multip;

    const start = 0;
    const end = game.starMap.length;

    for (let i = start; i < end; i++) {
        const star = game.starMap[i];

        if (star) {
            setRGBA(SW, star.x - SW + translatedX, i - SH + translatedY, star.alpha, star.alpha, star.alpha, 255, frame)
        }
    }
}   