import {gameCols, gameRows} from '../scenes/level';
import {type LevelScene, squareSize} from '../scenes/level';

const baseUrl = 'http://localhost:18080';

export async function init(scene: LevelScene) {
  return fetch(`${baseUrl}/init`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      level: scene.levelName,
      rows: gameRows,
      cols: gameCols,
      playerTank: {
        x: Math.floor(scene.playerTank.sprite.x / squareSize),
        y: Math.floor(scene.playerTank.sprite.y / squareSize),
        angle: scene.playerTank.sprite.angle,
      },
      enemyTanks: scene.enemyTanks.map((tank) => ({
        x: Math.floor(tank.sprite.x / squareSize),
        y: Math.floor(tank.sprite.y / squareSize),
        angle: tank.sprite.angle,
      })),
      walls: scene.walls.map((wall) => ({
        x: Math.floor(wall.x / squareSize),
        y: Math.floor(wall.y / squareSize),
      })),
    }),
  });
}

export async function update(scene: LevelScene) {
  const requestBody = JSON.stringify({
    playerTank: {
      x: Math.floor(scene.playerTank.sprite.x / squareSize),
      y: Math.floor(scene.playerTank.sprite.y / squareSize),
      angle: scene.playerTank.sprite.angle,
    },
    enemyTanks: scene.enemyTanks.map((tank) => ({
      x: Math.floor(tank.sprite.x / squareSize),
      y: Math.floor(tank.sprite.y / squareSize),
      angle: tank.sprite.angle,
    })),
    walls: scene.walls.map((wall) => ({
      x: Math.floor(wall.x / squareSize),
      y: Math.floor(wall.y / squareSize),
    })),
  });

  const response = await fetch(`${baseUrl}/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

export enum ActionType {
  NONE = -1,
  MOVE = 0,
  ROTATE = 1,
  FIRE = 2,
}

export enum Direction {
  UP = 0,
  DOWN = 1,
  LEFT = 2,
  RIGHT = 3,
}
