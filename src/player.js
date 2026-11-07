import { isWall } from "./map.js";

export function createPlayer() {
  return {
    x: 1.5,
    y: 1.5,
    angle: 0,
    speed: 3.0,
    hp: 100,
    ammo: 30,
    shootCooldown: 0,
    kills: 0,
  };
}

export function movePlayer(player, dx, dy) {
  const radius = 0.18;

  if (!isWall(player.x + dx + Math.sign(dx) * radius, player.y)) {
    player.x += dx;
  }

  if (!isWall(player.x, player.y + dy + Math.sign(dy) * radius)) {
    player.y += dy;
  }
}

export function registerPlayerControls(player, isGameActive) {
  onUpdate(() => {
    if (!isGameActive()) return;

    const delta = dt();
    const speed = player.speed * delta;

    if (isKeyDown("left") || isKeyDown("q")) {
      player.angle -= 2.2 * delta;
    }

    if (isKeyDown("right") || isKeyDown("e")) {
      player.angle += 2.2 * delta;
    }

    let forward = 0;
    let strafe = 0;

    if (isKeyDown("w")) forward++;
    if (isKeyDown("s")) forward--;
    if (isKeyDown("d")) strafe++;
    if (isKeyDown("a")) strafe--;

    const dx =
      Math.cos(player.angle) * forward * speed +
      Math.cos(player.angle + Math.PI / 2) * strafe * speed;

    const dy =
      Math.sin(player.angle) * forward * speed +
      Math.sin(player.angle + Math.PI / 2) * strafe * speed;

    movePlayer(player, dx, dy);
  });
}