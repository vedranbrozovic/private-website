import { TileData } from './types';

export function getTileKey(x: number, z: number): string {
  return `${Math.round(x)},${Math.round(z)}`;
}

export function parseTileKey(key: string): { x: number; z: number } {
  const [x, z] = key.split(',').map(Number);
  return { x, z };
}

export function getManhattanDistance(x1: number, z1: number, x2: number, z2: number): number {
  return Math.abs(x1 - x2) + Math.abs(z1 - z2);
}

export function getChebyshevDistance(x1: number, z1: number, x2: number, z2: number): number {
  return Math.max(Math.abs(x1 - x2), Math.abs(z1 - z2));
}

export function isTilePassable(x: number, z: number, tilesMap: Map<string, TileData>): boolean {
  const tile = tilesMap.get(getTileKey(x, z));
  if (!tile) return false;
  return tile.type !== 'deep_water';
}

/**
 * Check if the player can move to the target tile within immediate range,
 * or if the tile itself is passable.
 */
export function canMoveTo(
  fromX: number,
  fromZ: number,
  toX: number,
  toZ: number,
  maxRange: number,
  tilesMap: Map<string, TileData>
): boolean {
  if (Math.round(fromX) === Math.round(toX) && Math.round(fromZ) === Math.round(toZ)) return false;

  const dist = getChebyshevDistance(Math.round(fromX), Math.round(fromZ), Math.round(toX), Math.round(toZ));
  if (dist > maxRange) return false;

  return isTilePassable(toX, toZ, tilesMap);
}

/**
 * Find a smooth sequence of passable waypoints from (startX, startZ) to (goalX, goalZ)
 * using 8-directional A* search so click-to-move works across the entire 4x map.
 */
export function findPathWaypoints(
  startX: number,
  startZ: number,
  goalX: number,
  goalZ: number,
  tilesMap: Map<string, TileData>,
  maxSteps: number = 80
): Array<{ x: number; z: number }> {
  const sx = Math.round(startX);
  const sz = Math.round(startZ);
  let gx = Math.round(goalX);
  let gz = Math.round(goalZ);

  if (sx === gx && sz === gz) return [];

  // If goal is deep water, find nearest passable neighbor around goal
  if (!isTilePassable(gx, gz, tilesMap)) {
    let bestDist = Infinity;
    let found = false;
    for (let r = 1; r <= 4 && !found; r++) {
      for (let dx = -r; dx <= r; dx++) {
        for (let dz = -r; dz <= r; dz++) {
          if (isTilePassable(gx + dx, gz + dz, tilesMap)) {
            const d = Math.hypot(sx - (gx + dx), sz - (gz + dz));
            if (d < bestDist) {
              bestDist = d;
              gx = gx + dx;
              gz = gz + dz;
              found = true;
            }
          }
        }
      }
    }
    if (!found) return [];
  }

  // Check if direct line of sight is completely passable (for ultra-smooth straight walking)
  const distTotal = Math.hypot(gx - sx, gz - sz);
  const samples = Math.max(2, Math.ceil(distTotal * 2));
  let directClear = true;
  for (let i = 1; i <= samples; i++) {
    const t = i / samples;
    const tx = Math.round(sx + (gx - sx) * t);
    const tz = Math.round(sz + (gz - sz) * t);
    if (!isTilePassable(tx, tz, tilesMap)) {
      directClear = false;
      break;
    }
  }
  if (directClear) {
    return [{ x: gx, z: gz }];
  }

  // 8-way A* pathfinding
  const open: Array<{ x: number; z: number; g: number; f: number }> = [
    { x: sx, z: sz, g: 0, f: Math.hypot(gx - sx, gz - sz) },
  ];
  const cameFrom = new Map<string, { x: number; z: number }>();
  const gScore = new Map<string, number>();
  gScore.set(getTileKey(sx, sz), 0);
  const closed = new Set<string>();

  const dirs = [
    { dx: 1, dz: 0, cost: 1 },
    { dx: -1, dz: 0, cost: 1 },
    { dx: 0, dz: 1, cost: 1 },
    { dx: 0, dz: -1, cost: 1 },
    { dx: 1, dz: 1, cost: 1.414 },
    { dx: 1, dz: -1, cost: 1.414 },
    { dx: -1, dz: 1, cost: 1.414 },
    { dx: -1, dz: -1, cost: 1.414 },
  ];

  let closestNode = { x: sx, z: sz };
  let closestHeuristic = Math.hypot(gx - sx, gz - sz);
  let iterations = 0;

  while (open.length > 0 && iterations < 1200) {
    iterations++;
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;
    const cKey = getTileKey(current.x, current.z);

    if (current.x === gx && current.z === gz) {
      closestNode = { x: gx, z: gz };
      break;
    }

    if (closed.has(cKey)) continue;
    closed.add(cKey);

    const h = Math.hypot(gx - current.x, gz - current.z);
    if (h < closestHeuristic) {
      closestHeuristic = h;
      closestNode = { x: current.x, z: current.z };
    }

    for (const d of dirs) {
      const nx = current.x + d.dx;
      const nz = current.z + d.dz;
      const nKey = getTileKey(nx, nz);
      if (closed.has(nKey)) continue;
      if (!isTilePassable(nx, nz, tilesMap)) continue;

      const tentativeG = current.g + d.cost;
      const prevG = gScore.get(nKey) ?? Infinity;
      if (tentativeG < prevG) {
        cameFrom.set(nKey, { x: current.x, z: current.z });
        gScore.set(nKey, tentativeG);
        open.push({
          x: nx,
          z: nz,
          g: tentativeG,
          f: tentativeG + Math.hypot(gx - nx, gz - nz),
        });
      }
    }
  }

  const path: Array<{ x: number; z: number }> = [];
  let curr: { x: number; z: number } | undefined = closestNode;
  while (curr && !(curr.x === sx && curr.z === sz)) {
    path.unshift(curr);
    curr = cameFrom.get(getTileKey(curr.x, curr.z));
    if (path.length > maxSteps) break;
  }

  return path;
}

/**
 * Returns all coordinates within reachable range that are passable.
 */
export function getReachableTiles(
  playerX: number,
  playerZ: number,
  maxRange: number,
  tilesMap: Map<string, TileData>
): Array<{ x: number; z: number }> {
  const reachable: Array<{ x: number; z: number }> = [];
  const px = Math.round(playerX);
  const pz = Math.round(playerZ);

  for (let dx = -maxRange; dx <= maxRange; dx++) {
    for (let dz = -maxRange; dz <= maxRange; dz++) {
      if (dx === 0 && dz === 0) continue;
      const nx = px + dx;
      const nz = pz + dz;
      if (canMoveTo(px, pz, nx, nz, maxRange, tilesMap)) {
        reachable.push({ x: nx, z: nz });
      }
    }
  }

  return reachable;
}

/**
 * Calculate newly revealed tiles given the player position and radius.
 */
export function revealFogOfWar(
  playerX: number,
  playerZ: number,
  radius: number,
  currentRevealed: Set<string>,
  tilesMap: Map<string, TileData>
): { newlyRevealed: string[]; updatedRevealed: Set<string> } {
  const newlyRevealed: string[] = [];
  const updatedRevealed = new Set(currentRevealed);
  const px = Math.round(playerX);
  const pz = Math.round(playerZ);

  for (let dx = -radius; dx <= radius; dx++) {
    for (let dz = -radius; dz <= radius; dz++) {
      const dist = Math.sqrt(dx * dx + dz * dz);
      if (dist <= radius + 0.5) {
        const key = getTileKey(px + dx, pz + dz);
        if (tilesMap.has(key)) {
          if (!updatedRevealed.has(key)) {
            updatedRevealed.add(key);
            newlyRevealed.push(key);
          }
        }
      }
    }
  }

  return { newlyRevealed, updatedRevealed };
}

/**
 * Calculate discovery stats across biomes and landmarks
 */
export function calculateDiscoveryStats(
  discoveredLandmarks: Set<string>,
  totalLandmarks: number,
  revealedTiles: Set<string>,
  totalLandTiles: number
): {
  landmarkPercent: number;
  explorationPercent: number;
  isGrandTourComplete: boolean;
} {
  const landmarkPercent = totalLandmarks > 0 
    ? Math.round((discoveredLandmarks.size / totalLandmarks) * 100) 
    : 0;

  const explorationPercent = totalLandTiles > 0 
    ? Math.min(100, Math.round((revealedTiles.size / totalLandTiles) * 100))
    : 0;

  const isGrandTourComplete = discoveredLandmarks.size >= totalLandmarks;

  return {
    landmarkPercent,
    explorationPercent,
    isGrandTourComplete,
  };
}
