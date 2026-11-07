import kaboom from "https://unpkg.com/kaboom@3000.0.1/dist/kaboom.mjs";

import { createPlayer, registerPlayerControls } from "./player.js";
import { createEnemies, renderEnemies, updateEnemies } from "./enemies.js";
import { renderHUD } from "./hud.js";
import { renderWorld } from "./raycasting.js";
import { registerWeaponControls, updateWeapons } from "./weapons.js";

const WIDTH = 960;
const HEIGHT = 600;
const FOV = Math.PI / 3;
const MAX_DEPTH = 14;

const canvas = document.createElement("canvas");
document.querySelector("#game").appendChild(canvas);

kaboom({
  global: true,
  width: WIDTH,
  height: HEIGHT,
  canvas,
  background: [10, 10, 10],
  crisp: true,
});

console.log("Kaboom iniciado:", VERSION);

onUpdate(() => {
  console.log("UPDATE OK");
});

onDraw(() => {
  console.log("DRAW OK");
});

const player = createPlayer();
const enemies = createEnemies();
const gameState = {
  gameOver: false,
  victory: false,
  message: "",
  messageTime: 0,
  flashTime: 0,
};

const isGameActive = () => !gameState.gameOver && !gameState.victory;

registerPlayerControls(player, isGameActive);
registerWeaponControls(player, enemies, gameState, MAX_DEPTH);

onKeyPress("r", () => {
  if (!isGameActive()) {
    location.reload();
  }
});

onUpdate(() => {
  const delta = dt();

  updateWeapons(player, gameState, delta);

  if (!isGameActive()) return;

  updateEnemies(player, enemies, delta);

  if (player.hp <= 0) {
    player.hp = 0;
    gameState.gameOver = true;
  }

  if (enemies.every(enemy => !enemy.alive)) {
    gameState.victory = true;
  }
});

onDraw(() => {
  const depthBuffer = renderWorld(player, WIDTH, HEIGHT, FOV, MAX_DEPTH);
  renderEnemies(player, enemies, depthBuffer, WIDTH, HEIGHT, FOV);
  renderHUD(player, enemies, gameState, WIDTH, HEIGHT);
});