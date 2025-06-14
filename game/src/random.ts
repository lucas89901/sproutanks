import {xoroshiro128plus, unsafeUniformIntDistribution, RandomGenerator} from 'pure-rand';
import {Level, gameCols, gameRows} from './scenes/level';

let seed: number;
let rng: RandomGenerator;

export function setSeed(seedText: string): boolean {
  const seedTextInt = parseInt(seedText, 10);
  if (!isNaN(seedTextInt)) {
    seed = seedTextInt;
    rng = xoroshiro128plus(seed);
    return true;
  } else {
    seed = Date.now() ^ (Math.random() * 0x100000000);
    rng = xoroshiro128plus(seed);
    return false;
  }
}

export function getSeed(): number {
  return seed;
}

export function randomInt(min: number, max: number): number {
  return unsafeUniformIntDistribution(min, max, rng);
}

// [0, 1)
export function randomFloat(): number {
  return unsafeUniformIntDistribution(0, (1 << 24) - 1, rng) / (1 << 24);
}

function generateMazeWallsWilsons(
  cols: number,
  rows: number
): {x: number; y: number}[] {
  // Maze grid: true = path, false = wall
  const maze: boolean[][] = [];
  for (let x = 0; x < cols; x++) {
    maze[x] = [];
    for (let y = 0; y < rows; y++) {
      maze[x][y] = false;
    }
  }

  // Helper to get neighbors (4 directions)
  function neighbors(x: number, y: number): [number, number][] {
    const n: [number, number][] = [];
    if (x > 1) n.push([x - 2, y]);
    if (x < cols - 2) n.push([x + 2, y]);
    if (y > 1) n.push([x, y - 2]);
    if (y < rows - 2) n.push([x, y + 2]);
    return n;
  }

  // List of all cells (odd coordinates only)
  const cells: [number, number][] = [];
  for (let x = 0; x < cols; x += 2) {
    for (let y = 0; y < rows; y += 2) {
      cells.push([x, y]);
    }
  }

  // Pick a random cell to start the tree
  const startIdx = randomInt(0, cells.length - 1);
  const [startX, startY] = cells[startIdx];
  maze[startX][startY] = true;

  // Set of cells in the tree
  let inTree = new Set([`${startX},${startY}`]);

  // While there are unvisited cells
  while (inTree.size < cells.length) {
    // Pick a random unvisited cell
    let idx = randomInt(0, cells.length - 1);
    while (inTree.has(`${cells[idx][0]},${cells[idx][1]}`)) {
      idx = randomInt(0, cells.length - 1);
    }
    let [cx, cy] = cells[idx];
    // Perform loop-erased random walk
    const path: [number, number][] = [[cx, cy]];
    const visited = new Map<string, number>();
    visited.set(`${cx},${cy}`, 0);
    let found = false;
    while (!found) {
      const nbs = neighbors(cx, cy);
      const [nx, ny] = nbs[randomInt(0, nbs.length - 1)];
      // If we've already visited this cell in this walk, erase the loop
      const key = `${nx},${ny}`;
      if (visited.has(key)) {
        const loopStart = visited.get(key)!;
        path.splice(loopStart + 1);
        [cx, cy] = [nx, ny];
        path[path.length - 1] = [cx, cy];
        // Update visited map
        for (let i = path.length; i < visited.size; i++) {
          visited.delete(Array.from(visited.keys())[i]);
        }
      } else {
        path.push([nx, ny]);
        visited.set(key, path.length - 1);
        [cx, cy] = [nx, ny];
      }
      if (inTree.has(key)) {
        found = true;
      }
    }
    // Add the path to the tree
    for (let i = 0; i < path.length - 1; i++) {
      const [x1, y1] = path[i];
      const [x2, y2] = path[i + 1];
      maze[x1][y1] = true;
      maze[x2][y2] = true;
      // Also open the wall between
      maze[(x1 + x2) / 2][(y1 + y2) / 2] = true;
      inTree.add(`${x1},${y1}`);
      inTree.add(`${x2},${y2}`);
    }
  }

  // Collect wall positions (cells that are not path)
  const walls: {x: number; y: number}[] = [];
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      if (!maze[x][y]) {
        walls.push({x, y});
      }
    }
  }
  return walls;
}

// Returns a Set of reachable {x,y} positions from (startX, startY) given wall positions and grid size
function getReachableCells(
  startX: number,
  startY: number,
  walls: {x: number; y: number}[]
): Set<string> {
  const wallSet = new Set(walls.map((w) => `${w.x},${w.y}`));
  const visited = new Set<string>();
  const queue: [number, number][] = [[startX, startY]];
  while (queue.length > 0) {
    const [x, y] = queue.shift()!;
    const key = `${x},${y}`;
    if (
      visited.has(key) ||
      wallSet.has(key) ||
      x < 0 ||
      y < 0 ||
      x >= gameCols ||
      y >= gameRows
    ) {
      continue;
    }
    visited.add(key);
    // 4 directions
    queue.push([x + 1, y]);
    queue.push([x - 1, y]);
    queue.push([x, y + 1]);
    queue.push([x, y - 1]);
  }
  return visited;
}

export function randomLevel(hasWalls: boolean): Level {
  while (true) {
    const level: Level = {
      playerTank: {x: -1, y: -1},
      enemyTanks: [],
      walls: [],
    };

    if (hasWalls) {
      const walls = generateMazeWallsWilsons(gameCols, gameRows + 1);
      for (const wall of walls) {
        level.walls.push(wall);
      }
    }

    while (true) {
      level.playerTank.x = randomInt(0, gameCols - 1);
      level.playerTank.y = randomInt(0, gameRows - 1);
      if (
        !level.walls.some(
          (wall) =>
            wall.x === level.playerTank.x && wall.y === level.playerTank.y
        )
      ) {
        break;
      }
    }

    const reachable = getReachableCells(
      level.playerTank.x,
      level.playerTank.y,
      level.walls
    );
    for (let x = 0; x < gameCols; x++) {
      for (let y = 0; y < gameRows; y++) {
        if (
          (x !== level.playerTank.x || y !== level.playerTank.y) &&
          reachable.has(`${x},${y}`) &&
          !level.walls.some((wall) => wall.x === x && wall.y === y) &&
          randomFloat() < 0.2
        ) {
          level.enemyTanks.push({x, y});
        }
      }
    }

    // Ensure at least 5 enemy tanks.
    if (level.enemyTanks.length >= 5) {
      return level;
    }
  }
}
