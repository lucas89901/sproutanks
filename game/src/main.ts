import {Application} from 'pixi.js';

import {init as initInput} from './input/manual';
import {switchTo} from './scenes';

export const app = new Application();

(async () => {
  const container = document.getElementById('pixi-container')!;
  await app.init({background: '#1099bb', resizeTo: container});
  container.appendChild(app.canvas);
  app.stage.interactive = true;

  initInput(app);
  switchTo('menu');
})();
