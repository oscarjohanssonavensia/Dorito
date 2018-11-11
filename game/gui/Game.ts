import Game from "../models/Game";
import StarMap from './objects/Starmap';
import Clear from "./objects/Clear";
import Particles from "./objects/Particles";
import MiniMap from "./objects/MiniMap";
import MapEdge from "./objects/MapEdge";
import Ship from "./objects/Ship";
import PlayerStats from "./objects/PlayerStats";
import Stats from "./objects/Stats";
import GameIntro from "./objects/GameIntro";
import GameOver from "./objects/GameOver";
import GameDistortion from "./objects/GameDistortion";
import Asteroids from "./objects/Asteroids";
import { EngineContext } from '../engine/Game';
import MeasureTime from "../engine/math/MeasureTime";
import { MeasureTimeFn } from '../engine/math/MeasureTime';
import Wormhole from "./objects/Wormhole";
import Debug from "./objects/Debug";
import { RESOLUTION } from '../engine/objects/collision/Grid3dMapper';
import { onStage, line2 } from './Buffer';

export type GuiContext = {
    game: Game;
    step: number;
    stepMS: number;
    SW: number;
    SH: number;
    ctx: CanvasRenderingContext2D;
    frame: Uint8ClampedArray;
    imageData: ImageData;
    WW: number;
    WH: number;
    SX: number;
    SY: number;
}

export const stats = (guictx: GuiContext, engineTime: number, guiTime: number) => {
    Stats(guictx, engineTime, guiTime);
}



export default (guictx: GuiContext) => {
    const { ctx, WW, WH, SW, SX, SY, imageData, game, frame } = guictx;

    game.performance.gui = [];

    MeasureTime(Clear, guictx, false);
    MeasureTime(StarMap, guictx, false);
    MeasureTime(Asteroids, guictx, false);
    MeasureTime(Wormhole, guictx, false);
    if (!game.testMode) {
        MeasureTime(GameIntro, guictx, false);
    }
    MeasureTime(Particles, guictx, false);
    MeasureTime(MiniMap, guictx, false);
    MeasureTime(MapEdge, guictx, false);
    MeasureTime(Ship, guictx, false);
    if (!game.testMode) {
        MeasureTime(PlayerStats, guictx, false);
        MeasureTime(GameOver, guictx, false);
        MeasureTime(GameDistortion, guictx, false);
    }

    if (game.debug) {
        Debug(guictx);
    }


    MeasureTimeFn(() => ctx.putImageData(imageData, 0, 0), game.performance.gui);

}