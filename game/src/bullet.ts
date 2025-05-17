import {Assets, Sprite} from 'pixi.js';
import {Tank} from './tank';

(async () => {
  await Assets.load([
    {
      src: '/assets/bunny.png',
      alias: 'bullet',
    },
  ]);
})();

export class Bullet {
  private direction: number;
  private speed: number;
  source: Tank;

  sprite: Sprite;

  constructor(
    x: number,
    y: number,
    direction: number,
    speed: number,
    source: Tank
  ) {
    this.direction = direction;
    this.speed = speed;
    this.source = source;

    this.sprite = Sprite.from('bullet');
    this.sprite.position.set(x, y);
    this.sprite.anchor.set(0.5);
    this.sprite.zIndex = 3;
  }

  update() {
    this.sprite.x += Math.cos(this.direction) * this.speed;
    this.sprite.y += Math.sin(this.direction) * this.speed;
  }
}
