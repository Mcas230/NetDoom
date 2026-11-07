import { isWall } from "./map.js";

export function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

export function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function castRay(player, angle, maxDepth) {
  const step = 0.025;
  let dist = 0;

  const rayX = Math.cos(angle);
  const rayY = Math.sin(angle);

  while (dist < maxDepth) {
    const x = player.x + rayX * dist;
    const y = player.y + rayY * dist;

    if (isWall(x, y)) {
      return dist;
    }

    dist += step;
  }

  return maxDepth;
}

export function renderWorld(player, width, height, fov, maxDepth) {
  drawRect({
    pos: vec2(0, 0),
    width,
    height: height / 2,
    color: rgb(35, 35, 45),
  });

  drawRect({
    pos: vec2(0, height / 2),
    width,
    height: height / 2,
    color: rgb(48, 38, 32),
  });

  const depthBuffer = [];

  for (let x = 0; x < width; x += 2) {
    const rayAngle = player.angle - fov / 2 + (x / width) * fov;
    const rawDist = castRay(player, rayAngle, maxDepth);
    const corrected = rawDist * Math.cos(rayAngle - player.angle);

    depthBuffer[x] = corrected;
    depthBuffer[x + 1] = corrected;

    const wallHeight = Math.min(
      height,
      height / Math.max(0.08, corrected)
    );

    const shade = Math.max(35, 210 - corrected * 17);
    const stripe = Math.floor(player.x + player.y + corrected * 2) % 2;

    const wallColor = rgb(
      shade,
      Math.max(20, shade * 0.55),
      Math.max(15, shade * 0.38)
    );

    drawRect({
      pos: vec2(x, (height - wallHeight) / 2),
      width: 2,
      height: wallHeight,
      color: stripe
        ? wallColor
        : rgb(shade * 0.75, shade * 0.4, shade * 0.3),
    });
  }

  return depthBuffer;
}