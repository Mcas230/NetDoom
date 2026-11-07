import { distance, normalizeAngle } from "./raycasting.js";
import { isWall } from "./map.js";

export function createEnemies() {
  return [
    { x: 5.5, y: 1.5, hp: 2, alive: true },
    { x: 8.5, y: 4.5, hp: 2, alive: true },
    { x: 5.5, y: 7.5, hp: 2, alive: true },
  ];
}

export function updateEnemies(player, enemies, delta) {
  for (const enemy of enemies) {
    if (!enemy.alive) continue;

    const dist = distance(player, enemy);

    if (dist > 0.65) {
      const angle = Math.atan2(
        player.y - enemy.y,
        player.x - enemy.x
      );

      const speed = 0.65 * delta;
      const nx = enemy.x + Math.cos(angle) * speed;
      const ny = enemy.y + Math.sin(angle) * speed;

      if (!isWall(nx, enemy.y)) enemy.x = nx;
      if (!isWall(enemy.x, ny)) enemy.y = ny;
    } else {
      player.hp -= 12 * delta;
    }
  }
}

export function damageEnemy(enemy, player, gameState) {
  enemy.hp--;

  if (enemy.hp <= 0) {
    enemy.alive = false;
    player.kills++;
    gameState.message = "DEMONIO ELIMINADO";
    gameState.messageTime = 0.8;
  }
}

export function renderEnemies(player, enemies, depthBuffer, width, height, fov) {
  const visibleEnemies = enemies
    .filter(enemy => enemy.alive)
    .map(enemy => ({
      ...enemy,
      dist: distance(player, enemy),
      angle: normalizeAngle(
        Math.atan2(enemy.y - player.y, enemy.x - player.x)
        - player.angle
      ),
    }))
    .sort((a, b) => b.dist - a.dist);

  for (const enemy of visibleEnemies) {
    if (Math.abs(enemy.angle) > fov / 2 + 0.2) continue;

    const screenX = width / 2 + (enemy.angle / fov) * width;
    const size = Math.min(260, height / enemy.dist * 0.65);
    const depthAtEnemy = enemy.dist;

    if (
      depthBuffer[Math.floor(screenX)] !== undefined &&
      depthBuffer[Math.floor(screenX)] < depthAtEnemy
    ) continue;

    const y = height / 2 - size / 2;

    drawRect({
      pos: vec2(screenX - size * 0.23, y + size * 0.3),
      width: size * 0.46,
      height: size * 0.7,
      color: rgb(130, 35, 25),
    });

    drawRect({
      pos: vec2(screenX - size * 0.2, y),
      width: size * 0.4,
      height: size * 0.35,
      color: rgb(180, 65, 40),
    });

    drawRect({
      pos: vec2(screenX - size * 0.13, y + size * 0.14),
      width: size * 0.07,
      height: size * 0.06,
      color: rgb(255, 220, 40),
    });

    drawRect({
      pos: vec2(screenX + size * 0.06, y + size * 0.14),
      width: size * 0.07,
      height: size * 0.06,
      color: rgb(255, 220, 40),
    });
  }
}