import {Container} from 'pixi.js';

import {app} from '../main';
import {LevelScene} from './level';
import {MenuScene} from './menu';

export interface Scene {
  container: Container;
}

let currentScene: Scene | null = null;
export function switchTo(scene: string): void {
  if (currentScene) {
    currentScene.container.destroy({
      children: true,
    });
    app.stage.removeChild(currentScene.container);
    currentScene = null;
  }

  if (scene.startsWith('level')) {
    currentScene = new LevelScene(scene);
  } else if (scene === 'menu') {
    currentScene = new MenuScene();
  } else {
    throw new Error(`Unknown scene: ${scene}`);
  }
  app.stage.addChild(currentScene.container);
}

export function getCurrentLevelScene(): LevelScene | null {
  if (currentScene instanceof LevelScene) {
    return currentScene;
  }
  return null;
}
