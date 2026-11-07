import { castRay, normalizeAngle } from "./raycasting.js";
import { damageEnemy } from "./enemies.js";

export function shoot(player, enemies, gameState, maxDepth) {
  if (gameState.gameOver || gameState.victory) return;
  if (player.shootCooldown > 0) return;

  if (player.ammo <= 0) {
    gameState.message = "SIN MUNICION";
    gameState.messageTime = 0.8;
    return;
  }

  player.ammo--;
  player.shootCooldown = 0.35;
  gameState.flashTime = 0.08;

  let target = null;
  let closest = Infinity;

  for (const enemy of enemies) {
    if (!enemy.alive) continue;

    const dx = enemy.x - player.x;
    const dy = enemy.y - player.y;
    const dist = Math.hypot(dx, dy);

    const angle = normalizeAngle(
      Math.atan2(dy, dx) - player.angle
    );

    const wallDist = castRay(player, player.angle + angle, maxDepth);

    if (
      Math.abs(angle) < 0.13 &&
      dist < wallDist + 0.15 &&
      dist < closest
    ) {
      closest = dist;
      target = enemy;
    }
  }

  if (target) {
    damageEnemy(target, player, gameState);
  }
}

export function updateWeapons(player, gameState, delta) {
  player.shootCooldown = Math.max(0, player.shootCooldown - delta);
  gameState.flashTime = Math.max(0, gameState.flashTime - delta);
  gameState.messageTime = Math.max(0, gameState.messageTime - delta);
}

export function registerWeaponControls(player, enemies, gameState, maxDepth) {
  const fire = () => shoot(player, enemies, gameState, maxDepth);

  onMousePress("left", fire);
  onKeyPress("space", fire);
}