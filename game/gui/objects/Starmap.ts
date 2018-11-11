



import { setRGBA } from '../Buffer';
import { GuiContext } from '../Game';


export default (guiContext: GuiContext) => {

    const { SW, frame, SX, SY, WH, SH, game } = guiContext;
    /*
        const offset = 1;   // modify here somewhere to get parallax in stars
        const end = Math.floor((SY + SH) * offset);
        const start = Math.floor(SY * offset);
        for (let i = start; i < end; i++) {
            const star = game.starMap[i];
    
            if (star) {
                setRGBA(SW, star.x - SX, i - SY, star.alpha, star.alpha, star.alpha, 255, frame)
            }
    
        }
    
    */

    const offset = 1;   // modify here somewhere to get parallax in stars
    const end = Math.floor((WH - SY) * 0.1 + SH);
    let y = WH * 0.1;
    const start = Math.floor((WH - SY) * 0.1);
    for (let i = start; i < end; i++) {
        const star = game.starMap[i];

        if (star) {
            setRGBA(SW, star.x - SX * 0.1, y, star.alpha, star.alpha, star.alpha, star.alpha, frame)
        }
        y--;

    }

}