export const MAP = [
  "111111111111",
  "100000000001",
  "101100010001",
  "100000010001",
  "100110000001",
  "100000000001",
  "101000110001",
  "100000000001",
  "100000000001",
  "111111111111",
];

export const MAP_WIDTH = MAP[0].length;
export const MAP_HEIGHT = MAP.length;
export const TILE = 1;

export function isWall(x, y) {
  const mapX = Math.floor(x);
  const mapY = Math.floor(y);

  if (
    mapY < 0 || mapY >= MAP_HEIGHT ||
    mapX < 0 || mapX >= MAP_WIDTH
  ) return true;

  return MAP[mapY][mapX] === "1";
}