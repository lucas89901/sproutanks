import {type Application} from 'pixi.js';

const keys: {[key: string]: boolean} = {};
export let cursorX = 0;
export let cursorY = 0;

export function init(app: Application) {
  window.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
  });
  window.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
  });
  app.stage.addEventListener('pointermove', (e) => {
    cursorX = e.globalX;
    cursorY = e.globalY;
  });
  app.stage.addEventListener('pointerdown', (e) => {
    if (e.button === 0) {
      keys['leftmouse'] = true;
    }
    if (e.button === 2) {
      keys['rightmouse'] = true;
    }
  });
  app.stage.addEventListener('pointerup', (e) => {
    if (e.button === 0) {
      keys['leftmouse'] = false;
    }
    if (e.button === 2) {
      keys['rightmouse'] = false;
    }
  });
}

export function isKeyDown(key: string): boolean {
  return keys[key.toLowerCase()] || false;
}
