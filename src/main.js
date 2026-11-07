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

// Crear canvas
const canvas = document.createElement("canvas");
document.querySelector("#game").appendChild(canvas);

// Inicializar Kaboom
kaboom({
  global: true,
  width: WIDTH,
  height: HEIGHT,
  canvas,
  background: [10, 10, 10],
  crisp: true,
});

// Elementos del menú
const menu = document.querySelector("#main-menu");
const startButton = document.querySelector("#start-game");

// Crear jugador y enemigos
const player = createPlayer();
const enemies = createEnemies();

// Estado del juego
const gameState = {
  started: false,
  gameOver: false,
  victory: false,
  message: "",
  messageTime: 0,
  flashTime: 0,
};

// El juego solo está activo después de pulsar NEW GAME
const isGameActive = () =>
  gameState.started &&
  !gameState.gameOver &&
  !gameState.victory;

// Iniciar partida desde el menú
if (!menu || !startButton) {
  console.error("NETDOOM: no se encontró el menú o el botón");
} else {
  startButton.addEventListener("click", () => {
    console.log("NETDOOM: botón NEW GAME pulsado");

    gameState.started = true;
    menu.classList.add("is-hidden");
  });
}

// Registrar controles
registerPlayerControls(player, isGameActive);
registerWeaponControls(player, enemies, gameState, MAX_DEPTH);

// Reiniciar después de perder o ganar
onKeyPress("r", () => {
  if (gameState.started && !isGameActive()) {
    location.reload();
  }
});

// Actualización del juego
onUpdate(() => {
  // No actualizar nada mientras estamos en el menú
  if (!gameState.started) return;

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

// Dibujado del juego
onDraw(() => {
  const depthBuffer = renderWorld(
    player,
    WIDTH,
    HEIGHT,
    FOV,
    MAX_DEPTH
  );

  renderEnemies(
    player,
    enemies,
    depthBuffer,
    WIDTH,
    HEIGHT,
    FOV
  );

  renderHUD(player, enemies, gameState, WIDTH, HEIGHT);
});