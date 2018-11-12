import { GuiContext } from "../Game";
import Text from '../text/CreateText';
import { TextBuffer } from '../text/CreateText';

const TEXT_SIZE = 30;

const numbers = (() => {
    let numbers = {};

    for (let i = 0; i < 10; i++) {
        numbers[i] = Text.create(i + '', TEXT_SIZE, 'r');
    }
    const specialChars = ['-', '+', '?', '|', ' '];
    for (let i = 0; i < specialChars.length; i++) {

        numbers[specialChars[i]] = Text.create(specialChars[i], TEXT_SIZE, 'r');
    }
    return numbers;
})();


const hull_buffered_text = Text.create('hull:', TEXT_SIZE, 'r');
const score_buffered_text = Text.create('score:', TEXT_SIZE, 'r');
const shield_buffered_text = Text.create('shield:', TEXT_SIZE, 'r');
const enemies_buffered_text = Text.create('enemies:', TEXT_SIZE, 'r');




const addNumberToTextBuffer = (num: number, buffer: TextBuffer[]) => {
    const numArr = (num + '').split('');
    const numArrLen = numArr.length;

    for (let i = 0; i < numArrLen; i++) {
        buffer.push(numbers[numArr[i]]);
    }
}

export default (guiContext: GuiContext) => {
    const { frame, WW, WH, SW } = guiContext;

    const player = guiContext.game.player;

    const score = player.score;
    const life = player.life;

    const textBuffers = [hull_buffered_text];
    addNumberToTextBuffer(life, textBuffers);
    textBuffers.push(numbers['|']);

    textBuffers.push(score_buffered_text);
    addNumberToTextBuffer(score, textBuffers);
    textBuffers.push(numbers['|']);

    textBuffers.push(shield_buffered_text);
    addNumberToTextBuffer(player.shields, textBuffers);
    textBuffers.push(numbers['|']);

    textBuffers.push(enemies_buffered_text);
    addNumberToTextBuffer(guiContext.game.enemies.length, textBuffers);

    const w = Text.measureBuffers(textBuffers);

    Text.addList(SW, frame, textBuffers, (SW * 0.5) - w * 0.5, 20, guiContext.game.player.damageTaken);






}