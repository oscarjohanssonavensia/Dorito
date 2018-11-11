



import { setRGBA, fillRGBA, lineHorizontalRGBADash, lineVerticalRGBADash } from '../Buffer';
import { GuiContext } from '../Game';
import { Particle } from '../../models/Particle';
import { MAP_SAFETY_ZONE } from '../../engine/Consts';


const FILL_GAP = 200;
let fillCounter = 0;
export default (guiContext: GuiContext) => {

    const { SW, frame, step, WW, WH, SX, SY, SH, game } = guiContext;

    fillCounter += step * 2;
    if (fillCounter > FILL_GAP * 2) {
        fillCounter = 0;
    }



    const lineThreshold = MAP_SAFETY_ZONE * 1.5;
    const HL = SX > 0 ? SX < lineThreshold ? lineThreshold - SX : 0 : lineThreshold;
    const HR = SX + SW + lineThreshold < WW ? SW : WW - (SX + lineThreshold);

    const VT = SY > 0 ? SY < lineThreshold ? lineThreshold - SY : 0 : lineThreshold;
    const VB = SY + SH + lineThreshold < WH ? SH : WH - (SY + lineThreshold);

    const THICKNESS = 5;

    if (SY < lineThreshold) {
        lineHorizontalRGBADash(SW, HL, lineThreshold - SY, HR, 255, 0, 0, 255, frame, THICKNESS, FILL_GAP, FILL_GAP, fillCounter);
    } else if (SY > WH - (SH + lineThreshold)) {
        lineHorizontalRGBADash(SW, HL, WH - SY - lineThreshold, HR, 255, 0, 0, 255, frame, THICKNESS, FILL_GAP, FILL_GAP, fillCounter);
    }
    if (SX < lineThreshold) {
        lineVerticalRGBADash(SW, lineThreshold - SX, VT, VB, 255, 0, 0, 255, frame, THICKNESS, FILL_GAP, FILL_GAP, fillCounter);
    } else if (SX > WW - (SW + lineThreshold)) {
        lineVerticalRGBADash(SW, WW - SX - lineThreshold, VT, VB, 255, 0, 0, 255, frame, THICKNESS, FILL_GAP, FILL_GAP, fillCounter);
    }


}