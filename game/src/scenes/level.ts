import {
  Assets,
  Container,
  Graphics,
  PointData,
  Texture,
  Text,
  Ticker,
} from 'pixi.js';

import {Scene, switchTo} from '.';
import {Bullet} from '../bullet';
import {Tank, PlayerTank, EnemyTank} from '../tank';
import {addResult, getMode} from '../game';
import {init as initAgent} from '../input/agent';
import {randomLevel} from '../random';

export const squareSize = 80;
export const gameCols = 15;
export const gameRows = 8;
export const gameWidth = squareSize * gameCols;
export const gameHeight = squareSize * gameRows;
const borderWidth = 16;

(async () => {
  await Assets.load([
    {
      src: 'assets/wall.png',
      alias: 'wall',
    },
  ]);
})();

export type Level = {
  playerTank: PointData;
  enemyTanks: PointData[];
  walls: PointData[];
};

const staticLevels: {[key: string]: Level} = {
  level0: {
    playerTank: {x: 3, y: 1},
    enemyTanks: [{x: 10, y: 3}],
    walls: [
      {x: 5, y: 0},
      {x: 5, y: 1},
      {x: 5, y: 2},
      {x: 5, y: 5},
      {x: 5, y: 6},
      {x: 5, y: 7},
    ],
  },
  level1: {
    playerTank: {x: 0, y: 4},
    enemyTanks: [
      {x: 3, y: 1},
      {x: 6, y: 1},
      {x: 3, y: 6},
      {x: 6, y: 6},

      {x: 9, y: 1},
      {x: 12, y: 1},
      {x: 9, y: 6},
      {x: 12, y: 6},
    ],
    walls: [
      {x: 2, y: 0},
      {x: 2, y: 1},
      {x: 2, y: 2},
      {x: 3, y: 0},
      {x: 4, y: 0},

      {x: 5, y: 0},
      {x: 6, y: 0},
      {x: 7, y: 0},
      {x: 7, y: 1},
      {x: 7, y: 2},

      {x: 2, y: 5},
      {x: 2, y: 6},
      {x: 2, y: 7},
      {x: 3, y: 7},
      {x: 4, y: 7},

      {x: 5, y: 7},
      {x: 6, y: 7},
      {x: 7, y: 7},
      {x: 7, y: 6},
      {x: 7, y: 5},

      {x: 8, y: 0},
      {x: 8, y: 1},
      {x: 8, y: 2},
      {x: 9, y: 0},
      {x: 10, y: 0},

      {x: 11, y: 0},
      {x: 12, y: 0},
      {x: 13, y: 0},
      {x: 13, y: 1},
      {x: 13, y: 2},

      {x: 8, y: 5},
      {x: 8, y: 6},
      {x: 8, y: 7},
      {x: 9, y: 7},
      {x: 10, y: 7},

      {x: 11, y: 7},
      {x: 12, y: 7},
      {x: 13, y: 7},
      {x: 13, y: 6},
      {x: 13, y: 5},
    ],
  },
  level2: {
    playerTank: {x: 2, y: 3},
    enemyTanks: [
      {x: 4, y: 0},
      {x: 8, y: 0},
      {x: 12, y: 4},
      {x: 11, y: 7},
      {x: 8, y: 5},
      {x: 10, y: 2},
    ],

    walls: [
      {x: 2, y: 1},
      {x: 3, y: 1},
      {x: 4, y: 1},
      {x: 5, y: 1},
      {x: 6, y: 1},
      {x: 7, y: 1},
      {x: 7, y: 2},
      {x: 7, y: 3},
      {x: 7, y: 4},
      {x: 7, y: 5},
      {x: 7, y: 6},
      {x: 8, y: 6},
      {x: 9, y: 6},
      {x: 10, y: 6},
      {x: 11, y: 6},
      {x: 12, y: 6},
    ],
  },
  level3: {
    playerTank: {x: 1, y: 6},
    enemyTanks: [
      {x: 2, y: 1},
      {x: 10, y: 5},
      {x: 9, y: 7},
      {x: 14, y: 1},
      {x: 11, y: 0},
      {x: 7, y: 0},
    ],
    walls: [
      {x: 0, y: 4},
      {x: 1, y: 4},
      {x: 2, y: 4},
      {x: 3, y: 4},
      {x: 4, y: 4},
      {x: 5, y: 4},
      {x: 5, y: 5},
      {x: 5, y: 6},

      {x: 5, y: 0},
      {x: 5, y: 1},
      {x: 5, y: 2},
      {x: 4, y: 2},
      {x: 3, y: 2},

      {x: 8, y: 7},
      {x: 8, y: 6},
      {x: 8, y: 5},
      {x: 8, y: 4},
      {x: 9, y: 4},
      {x: 10, y: 4},
      {x: 11, y: 4},

      {x: 8, y: 1},
      {x: 8, y: 2},
      {x: 9, y: 2},
      {x: 10, y: 2},
      {x: 11, y: 2},
      {x: 12, y: 2},
      {x: 13, y: 2},
      {x: 14, y: 2},
    ],
  },
  level4: {
    playerTank: {x: 2, y: 1},
    enemyTanks: [
      {x: 0, y: 0},
      {x: 0, y: 3},
      {x: 0, y: 5},
      {x: 0, y: 7},

      {x: 2, y: 3},
      {x: 2, y: 5},
      {x: 6, y: 1},
      {x: 8, y: 1},
      {x: 10, y: 1},
      {x: 14, y: 0},
      {x: 14, y: 7},
    ],
    walls: [
      {x: 1, y: 2},
      {x: 1, y: 4},
      {x: 1, y: 6},

      {x: 2, y: 2},
      {x: 2, y: 4},
      {x: 2, y: 6},

      {x: 3, y: 2},
      {x: 3, y: 4},
      {x: 3, y: 6},

      {x: 5, y: 0},
      {x: 5, y: 1},
      {x: 5, y: 2},

      {x: 7, y: 0},
      {x: 7, y: 1},
      {x: 7, y: 2},

      {x: 9, y: 0},
      {x: 9, y: 1},
      {x: 9, y: 2},

      {x: 11, y: 0},
      {x: 11, y: 1},
      {x: 11, y: 2},
    ],
  },
};

export function gridToWorld(pos: number, anchor: number = 0.5): number {
  return pos * squareSize + squareSize * anchor;
}

export function isInGameArea(x: number, y: number): boolean {
  return x >= 0 && x < gameWidth && y >= 0 && y < gameHeight;
}

function createBackground(
  squareSize: number,
  cols: number,
  rows: number,
  lightColor: string,
  darkColor: string
): Container {
  const bg = new Container();
  const checkboard = new Graphics({
    parent: bg,
    x: 0,
    y: 0,
    zIndex: -1,
  });
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const color = (x + y) % 2 === 0 ? lightColor : darkColor;
      checkboard
        .rect(x * squareSize, y * squareSize, squareSize, squareSize)
        .fill({
          color: color,
        });
    }
  }

  for (let x = 0; x < cols; x++) {
    new Text({
      parent: bg,
      x: squareSize * (x + 1) - 4,
      y: gameHeight - 2,
      anchor: 1,
      text: `${x}`,
      style: {
        fontSize: 12,
        fill: '#444444',
        fontFamily: 'Verdana',
      },
    });
  }
  for (let y = 0; y < rows; y++) {
    new Text({
      parent: bg,
      x: gameWidth - 10,
      y: squareSize * y + 2,
      anchor: 0,
      text: `${y}`,
      style: {
        fontSize: 12,
        fill: '#444444',
        fontFamily: 'Verdana',
      },
    });
  }
  return bg;
}

export class LevelScene implements Scene {
  container: Container;
  gameArea: Container;
  ticker: Ticker;
  playerTicker: Ticker;

  levelName: string;

  playerTank: PlayerTank;
  enemyTanks: EnemyTank[] = [];
  bullets: Bullet[] = [];
  walls: Graphics[] = [];

  constructor(levelName: string) {
    this.container = new Container();

    let level: Level;
    if (levelName === 'level5') {
      level = randomLevel(false);
    } else if (levelName === 'level6') {
      level = randomLevel(true);
    } else {
      level = staticLevels[levelName];
    }
    this.levelName = levelName;

    const borderWalls = new Graphics({
      parent: this.container,
      x: 0,
      y: 0,
      zIndex: 1,
    });
    const wallTexture = Texture.from('wall');
    borderWalls
      .rect(0, 0, gameWidth + borderWidth, borderWidth)
      .rect(0, gameHeight + borderWidth, gameWidth + borderWidth, borderWidth)
      .rect(0, 0, borderWidth, gameHeight + borderWidth)
      .rect(
        gameWidth + borderWidth,
        0,
        borderWidth,
        gameHeight + 2 * borderWidth
      )
      .fill({texture: wallTexture});

    this.gameArea = new Container({
      parent: this.container,
      x: borderWidth,
      y: borderWidth,
      //width: gameWidth,
      //height: gameHeight,
    });
    const bg = createBackground(
      squareSize,
      Math.ceil(gameWidth / squareSize),
      Math.ceil(gameHeight / squareSize),
      '#f4e0aa',
      '#cb9565'
    );
    this.gameArea.addChild(bg);

    this.walls = level.walls.map((wall) =>
      new Graphics({
        parent: this.gameArea,
        x: gridToWorld(wall.x, 0),
        y: gridToWorld(wall.y, 0),
        zIndex: 1,
      })
        .rect(0, 0, squareSize, squareSize)
        .fill({texture: wallTexture})
    );
    if (this.walls.length > 0) {
      this.gameArea.addChild(...this.walls);
    }

    this.playerTank = new PlayerTank(
      gridToWorld(level.playerTank.x),
      gridToWorld(level.playerTank.y)
    );
    this.gameArea.addChild(this.playerTank.sprite);

    this.enemyTanks = level.enemyTanks.map(
      (enemyTank) =>
        new EnemyTank(
          gridToWorld(enemyTank.x),
          gridToWorld(enemyTank.y),
          'tank_red1'
        )
    );
    this.enemyTanks.forEach((enemyTank) => {
      this.gameArea.addChild(enemyTank.sprite);
    });

    this.ticker = new Ticker();
    this.ticker.add(this.update.bind(this));
    this.ticker.start();

    this.playerTicker = new Ticker();
    this.playerTicker.add(this.updatePlayer.bind(this));
    if (getMode() === 'agent') {
      this.playerTicker.minFPS = 1;
      this.playerTicker.maxFPS = 2;
    }
    this.playerTicker.start();

    if (getMode() === 'agent') {
      initAgent(this);
    }
  }

  willCollide(x: Container, y: Container): boolean {
    if (x === y) {
      return false;
    }
    const xHitbox = x.getBounds().pad(0);
    return xHitbox.rectangle.intersects(y.getBounds().rectangle);
  }
  willCollideAny(x: Container): boolean {
    if (
      this.willCollide(x, this.playerTank.sprite) ||
      this.enemyTanks.some((enemyTank) =>
        this.willCollide(x, enemyTank.sprite)
      ) ||
      this.walls.some((wall) => this.willCollide(x, wall))
    ) {
      return true;
    }
    return false;
  }

  fire(tank: Tank): void {
    const bullet = new Bullet(
      tank.sprite.x,
      tank.sprite.y,
      tank.sprite.rotation,
      tank.bulletSpeed,
      tank
    );
    this.bullets.push(bullet);
    this.gameArea.addChild(bullet.sprite);
  }

  updatePlayer(): void {
    this.playerTank.update();
  }

  update(): void {
    this.enemyTanks.forEach((enemyTank) => {
      enemyTank.update();
    });
    this.bullets.forEach((bullet) => {
      bullet.update();

      if (
        !isInGameArea(bullet.sprite.x, bullet.sprite.y) ||
        this.walls.some((wall) => this.willCollide(bullet.sprite, wall))
      ) {
        this.gameArea.removeChild(bullet.sprite);
        this.bullets = this.bullets.filter((b) => b !== bullet);
      }

      this.bullets.forEach((otherBullet) => {
        if (
          bullet !== otherBullet &&
          this.willCollide(bullet.sprite, otherBullet.sprite)
        ) {
          this.gameArea.removeChild(bullet.sprite);
          this.bullets = this.bullets.filter((b) => b !== bullet);
          this.gameArea.removeChild(otherBullet.sprite);
          this.bullets = this.bullets.filter((b) => b !== otherBullet);
        }
      });

      if (
        this.playerTank !== bullet.source &&
        this.willCollide(this.playerTank.sprite, bullet.sprite)
      ) {
        console.log('Game over');
        this.ticker.stop();
        this.playerTicker.stop();
        addResult({
          level: this.levelName,
          result: 'lose',
          mode: getMode(),
          movements: this.playerTank.movements,
          rotations: this.playerTank.rotations,
          shots: this.playerTank.shots,
        });
        switchTo('menu');
        return;
      }

      this.enemyTanks.forEach((enemyTank) => {
        if (
          enemyTank !== bullet.source &&
          this.willCollide(enemyTank.sprite, bullet.sprite)
        ) {
          this.gameArea.removeChild(bullet.sprite);
          this.bullets = this.bullets.filter((b) => b !== bullet);
          this.gameArea.removeChild(enemyTank.sprite);
          this.enemyTanks = this.enemyTanks.filter((et) => et !== enemyTank);
        }
      });
    });

    if (this.enemyTanks.length === 0) {
      console.log('You win');
      this.ticker.stop();
      this.playerTicker.stop();
      addResult({
        level: this.levelName,
        result: 'win',
        mode: getMode(),
        movements: this.playerTank.movements,
        rotations: this.playerTank.rotations,
        shots: this.playerTank.shots,
      });
      switchTo('menu');
      return;
    }
  }
}
