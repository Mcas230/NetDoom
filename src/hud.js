export function renderHUD(player, enemies, gameState, width, height) {
  drawRect({
    pos: vec2(width / 2 - 10, height / 2 - 1),
    width: 20,
    height: 2,
    color: rgb(255, 255, 255),
  });

  drawRect({
    pos: vec2(width / 2 - 1, height / 2 - 10),
    width: 2,
    height: 20,
    color: rgb(255, 255, 255),
  });

  drawRect({
    pos: vec2(width / 2 - 55, height - 145),
    width: 110,
    height: 115,
    color: rgb(70, 70, 75),
  });

  drawRect({
    pos: vec2(width / 2 - 19, height - 190),
    width: 38,
    height: 75,
    color: rgb(95, 95, 100),
  });

  if (gameState.flashTime > 0) {
    drawRect({
      pos: vec2(width / 2 - 25, height - 220),
      width: 50,
      height: 35,
      color: rgb(255, 220, 80),
    });
  }

  drawRect({
    pos: vec2(0, height - 30),
    width,
    height: 30,
    color: rgb(15, 15, 15),
  });

  drawText({
    text: `VIDA: ${Math.ceil(player.hp)}`,
    pos: vec2(20, height - 23),
    size: 20,
    color: rgb(255, 70, 60),
  });

  drawText({
    text: `MUNICION: ${player.ammo}`,
    pos: vec2(350, height - 23),
    size: 20,
    color: rgb(255, 220, 70),
  });

  drawText({
    text: `BAJAS: ${player.kills}/${enemies.length}`,
    pos: vec2(710, height - 23),
    size: 20,
    color: rgb(100, 255, 100),
  });

  if (gameState.messageTime > 0) {
    drawText({
      text: gameState.message,
      pos: vec2(width / 2, 65),
      size: 24,
      anchor: "center",
      color: rgb(255, 220, 80),
    });
  }

  if (gameState.gameOver || gameState.victory) {
    drawRect({
      pos: vec2(0, 0),
      width,
      height,
      color: rgb(0, 0, 0),
      opacity: 0.75,
    });

    drawText({
      text: gameState.victory ? "NIVEL COMPLETADO" : "GAME OVER",
      pos: vec2(width / 2, height / 2 - 30),
      size: 42,
      anchor: "center",
      color: gameState.victory
        ? rgb(80, 255, 100)
        : rgb(255, 50, 40),
    });

    drawText({
      text: "PULSA R PARA REINICIAR",
      pos: vec2(width / 2, height / 2 + 35),
      size: 20,
      anchor: "center",
      color: rgb(255, 255, 255),
    });
  }
}