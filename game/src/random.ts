import {xoroshiro128plus, unsafeUniformIntDistribution} from 'pure-rand';
import {Level, gameCols, gameRows} from './scenes/level';

const seed = Date.now() ^ (Math.random() * 0x100000000);
//const seed = 2025;
const rng = xoroshiro128plus(seed);

export function randomInt(min: number, max: number): number {
  return unsafeUniformIntDistribution(min, max, rng);
}

// [0, 1)
export function randomFloat(): number {
  return unsafeUniformIntDistribution(0, (1 << 24) - 1, rng) / (1 << 24);
}

export function randomLevel(): Level {
  const level: Level = {
    playerTank: {
      x: randomInt(0, gameCols - 1),
      y: randomInt(0, gameRows - 1),
    },
    enemyTanks: [],
    walls: [],
  };
  for (let x = 0; x < gameCols; x++) {
    for (let y = 0; y < gameRows; y++) {
      if (
        level.playerTank.x !== x &&
        level.playerTank.y !== y &&
        randomFloat() < 0.2
      ) {
        level.enemyTanks.push({x, y});
      }
    }
  }
  return level;
}
