import {Assets, Sprite} from 'pixi.js';

import {getMode} from './game';
import {getCurrentLevelScene} from './scenes';
import {
  gameWidth,
  gameHeight,
  gameCols,
  gameRows,
  squareSize,
} from './scenes/level';
import {isKeyDown, cursorX, cursorY} from './input/manual';
import {update as updateAgent, ActionType, Direction} from './input/agent';

(async () => {
  await Assets.load([
    {
      src: 'assets/tank_blue1.png',
      alias: 'tank_blue1',
    },
    {
      src: 'assets/tank_blue3.png',
      alias: 'tank_blue3',
    },
    {
      src: 'assets/tank_red1.png',
      alias: 'tank_red1',
    },
  ]);
})();

export abstract class Tank {
  speed: number = 1;
  bulletSpeed: number = 5;

  sprite: Sprite;

  constructor(x: number, y: number, texture: string) {
    this.sprite = Sprite.from(texture);
    this.sprite.anchor.set(0.5);
    this.sprite.position.set(x, y);
    this.sprite.scale.set(0.3);
    this.sprite.zIndex = 1;
  }

  //isHit(x: number, y: number): boolean {
  //  return (
  //    x > this.sprite.x - this.sprite.width / 2 &&
  //    x < this.sprite.x + this.sprite.width / 2 &&
  //    y < this.sprite.y + this.sprite.height / 2 &&
  //    y > this.sprite.y - this.sprite.height / 2
  //  );
  //}

  fire(): void {
    getCurrentLevelScene()!.fire(this);
  }
  abstract update(): void;
}

export class PlayerTank extends Tank {
  hasFired: boolean = false;
  movements: number = 0;
  rotations: number = 0;
  shots: number = 0;

  constructor(x: number, y: number) {
    super(x, y, 'tank_blue3');
  }

  private updateMove(): void {
    let dx = 0;
    let dy = 0;
    if (isKeyDown('W')) {
      --dy;
    }
    if (isKeyDown('S')) {
      ++dy;
    }
    if (isKeyDown('A')) {
      --dx;
    }
    if (isKeyDown('D')) {
      ++dx;
    }
    if (dx === 0 && dy === 0) {
      return;
    }
    const unit = Math.hypot(dx, dy);
    const x2 = this.sprite.x + (dx / unit) * this.speed;
    const y2 = this.sprite.y + (dy / unit) * this.speed;
    if (
      x2 - this.sprite.width / Math.sqrt(2) > 0 &&
      x2 + this.sprite.width / Math.sqrt(2) < gameWidth &&
      y2 - this.sprite.height / Math.sqrt(2) > 0 &&
      y2 + this.sprite.height / Math.sqrt(2) < gameHeight &&
      !getCurrentLevelScene()!.willCollideAny(this.sprite)
    ) {
      this.sprite.x = x2;
      this.sprite.y = y2;
    }
  }

  update(): void {
    if (getMode() === 'manual') {
      this.sprite.rotation = Math.atan2(
        cursorY - this.sprite.y - this.sprite.height / 2,
        cursorX - this.sprite.x
      );
      this.updateMove();

      if (isKeyDown('leftmouse')) {
        if (this.hasFired) {
          return;
        }
        this.fire();
        this.hasFired = true;
      } else {
        this.hasFired = false;
      }
    } else if (getMode() === 'agent') {
      (async () => {
        const action = await updateAgent(getCurrentLevelScene()!);
        //console.log(action);
        switch (action.type) {
          case ActionType.MOVE:
            ++this.movements;
            let x2 = this.sprite.x;
            let y2 = this.sprite.y;
            switch (action.direction) {
              case Direction.UP:
                y2 -= squareSize;
                this.sprite.angle = -90;
                break;
              case Direction.DOWN:
                y2 += squareSize;
                this.sprite.angle = 90;
                break;
              case Direction.LEFT:
                x2 -= squareSize;
                this.sprite.angle = 180;
                break;
              case Direction.RIGHT:
                x2 += squareSize;
                this.sprite.angle = 0;
                break;
            }
            if (
              Math.floor(x2 / squareSize) >= 0 &&
              Math.floor(x2 / squareSize) < gameCols &&
              Math.floor(y2 / squareSize) >= 0 &&
              Math.floor(y2 / squareSize) < gameRows &&
              !getCurrentLevelScene()!.walls.some(
                (wall) =>
                  Math.floor(wall.x / squareSize) ===
                    Math.floor(x2 / squareSize) &&
                  Math.floor(wall.y / squareSize) ===
                    Math.floor(y2 / squareSize)
              ) &&
              !getCurrentLevelScene()!.enemyTanks.some(
                (tank) =>
                  Math.floor(tank.sprite.x / squareSize) ===
                    Math.floor(x2 / squareSize) &&
                  Math.floor(tank.sprite.y / squareSize) ===
                    Math.floor(y2 / squareSize)
              )
            ) {
              this.sprite.x = x2;
              this.sprite.y = y2;
            }
            break;
          case ActionType.ROTATE:
            ++this.rotations;
            this.sprite.angle = action.angle;
            break;
          case ActionType.FIRE:
            ++this.shots;
            this.fire();
            break;
        }
      })();
    }
  }
}

export class EnemyTank extends Tank {
  //rotateDirection: number = 1;

  constructor(x: number, y: number, texture: string) {
    super(x, y, texture);
    this.sprite.rotation = Math.random() * Math.PI * 2;
  }

  update(): void {
    //if (this.sprite.rotation < (2 / 3) * Math.PI) {
    //  this.rotateDirection = 1;
    //} else if (this.sprite.rotation > (4 / 3) * Math.PI) {
    //  this.rotateDirection = -1;
    //}
    //this.sprite.rotation += this.rotateDirection * 0.01;
    //if (Math.random() < 0.01) {
    //  this.fire();
    //}
  }
}
