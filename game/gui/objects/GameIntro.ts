import { GuiContext } from "../Game";
import Text from '../text/CreateText';
import { GAME_INTRO_TIMER } from '../../engine/Consts';

const GET_BUFFERED_TEXT = Text.create('GET', 150, 280, 140, 'r');
const READY_BUFFERED_TEXT = Text.create('READY', 150, 410, 140, 'r');

const BUFFERED_TEXT_1 = Text.create('1', 450, 240, 400, 'r');
const BUFFERED_TEXT_2 = Text.create('2', 450, 240, 400, 'r');
const BUFFERED_TEXT_3 = Text.create('3', 450, 240, 400, 'r');
let initGame = GAME_INTRO_TIMER;

export default (guictx: GuiContext) => {
    const { frame, SW } = guictx;

    initGame--;
    let x = 300;
    let y = 300;
    if (initGame > 0) {

        let numberBuffer = BUFFERED_TEXT_3;
        if (initGame < 200) {
            numberBuffer = BUFFERED_TEXT_2;
        }
        if (initGame < 100) {
            numberBuffer = BUFFERED_TEXT_1;
        }

        if (initGame < 8) {
            x = 300 + (Math.random() - 0.5) * SW * 0.4;

            y = 300 + (Math.random() - 0.5) * SW * 0.4;
        }


        Text.addList(SW, frame, [GET_BUFFERED_TEXT, READY_BUFFERED_TEXT, numberBuffer], x, y, true);

    } else if (initGame === 0) {

    }

}