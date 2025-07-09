import "./style.css";

import { Game } from "./Game";

export const TICKS_PER_SECOND = 1;
export const tickInterval = 1000 / TICKS_PER_SECOND;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <canvas id="game-canvas" width="800" height="600" style="border: 1px solid black;"></canvas>
  </div>
`;

const canvas = document.getElementById("game-canvas") as HTMLCanvasElement;
const game = new Game(canvas);
game.start();
