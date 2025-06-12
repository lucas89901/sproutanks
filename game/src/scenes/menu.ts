import {Container, Graphics, Text} from 'pixi.js';
import {ButtonContainer, CheckBox, Input, RadioGroup} from '@pixi/ui';

import {Scene, switchTo} from '.';
import {setMode} from '../game';
import {setSeed} from '../random';
import {gameWidth} from '../scenes/level';

const buttonHeight = 50;
const buttonWidth = 200;

function newRadio(radius: number, fill: boolean): Graphics {
  const graphics = new Graphics();
  graphics.circle(radius / 2, radius / 2, radius / 2).fill('#F1D583');
  if (fill) {
    const center = radius / 2;
    graphics.circle(center, center, center - 4).fill('#82C822');
  }
  return graphics;
}

function newButton(
  x: number,
  y: number,
  text: string,
  onClick: any
): ButtonContainer {
  const button = new ButtonContainer();
  button.position.set(x, y);

  const buttonBox = new Graphics({
    parent: button,
    x: 0,
    y: 0,
  })
    .roundRect(0, 0, buttonWidth, buttonHeight, 10)
    .stroke({color: 0xffffff});

  new Text({
    parent: button,
    x: buttonWidth / 2,
    y: buttonHeight / 2 - 2,
    anchor: 0.5,
    text: text,
    style: {
      fontSize: 20,
      fill: '#ffffff',
      fontFamily: 'Verdana',
      fontWeight: 'bold',
      align: 'center',
    },
  });
  button.onHover.connect(() => {
    //buttonBox.save();
    buttonBox.fill({color: '#777777'});
  });
  button.onOut.connect(() => {
    //buttonBox.restore();
    // Temporary fix. Not sure why save() and restore() doesn't work.
    buttonBox
      .clear()
      .roundRect(0, 0, buttonWidth, buttonHeight, 10)
      .stroke({color: 0xffffff});
  });
  button.onPress.connect(onClick);
  return button;
}

export class MenuScene implements Scene {
  container: Container;

  constructor() {
    this.container = new Container();
    new Text({
      parent: this.container,
      x: gameWidth / 2,
      y: 100,
      anchor: 0.5,
      text: 'Sproutanks!!',
      style: {
        fontSize: 40,
        fill: '#ffffff',
        fontFamily: 'Verdana',
        fontWeight: 'bold',
        align: 'center',
      },
    });

    const modeSelector = new Container({
      parent: this.container,
      x: 200,
      y: 250,
    });
    new Text({
      parent: modeSelector,
      x: 50,
      y: 0,
      anchor: 0.5,
      text: 'Mode',
      style: {
        fontSize: 20,
        fill: '#ffffff',
        fontFamily: 'Verdana',
        fontWeight: 'bold',
        align: 'center',
      },
    });

    setMode('manual');
    const modeRadioGroup = new RadioGroup({
      items: [
        new CheckBox({
          style: {
            unchecked: newRadio(20, false),
            checked: newRadio(20, true),
            text: {
              fontSize: 20,
              fill: '#ffffff',
              fontFamily: 'Verdana',
              fontWeight: 'bold',
              align: 'center',
            },
          },
          text: 'Manual',
        }),
        new CheckBox({
          style: {
            unchecked: newRadio(20, false),
            checked: newRadio(20, true),
            text: {
              fontSize: 20,
              fill: '#ffffff',
              fontFamily: 'Verdana',
              fontWeight: 'bold',
              align: 'center',
            },
          },
          text: 'Agent',
        }),
      ],
      type: 'vertical',
      elementsMargin: 10,
      selectedItem: 0,
    });
    modeRadioGroup.position.set(0, 50);
    modeRadioGroup.onChange.connect((_: number, selectedVal: string) => {
      setMode(selectedVal);
    });
    modeSelector.addChild(modeRadioGroup);

    const seedInputContainer = new Container({
      parent: this.container,
      x: 200,
      y: 450,
    });

    new Text({
      parent: seedInputContainer,
      x: 50,
      y: 0,
      anchor: 0.5,
      text: 'Random Seed',
      style: {
        fontSize: 20,
        fill: '#ffffff',
        fontFamily: 'Verdana',
        fontWeight: 'bold',
        align: 'center',
      },
    });
    const seedInput = new Input({
      bg: new Graphics().roundRect(0, 0, 250, 40, 10).stroke({
        color: '#ffffff',
        width: 2,
      }),
      padding: 10,
      placeholder: 'Enter seed...',
      textStyle: {
        fontSize: 16,
        fill: '#ffffff',
        fontFamily: 'Verdana',
        fontWeight: 'bold',
      },
    });
    seedInput.position.set(-75, 20);
    seedInputContainer.addChild(seedInput);
    seedInput.onChange.connect((text: string) => {
      setSeed(text);
    });

    const sep = 75;
    this.container.addChild(
      newButton(gameWidth / 2 - buttonWidth / 2 - 10, 200, 'Level 0', () => {
        switchTo('level0');
      }),
      newButton(
        gameWidth / 2 - buttonWidth / 2 - 10,
        200 + sep,
        'Level 1',
        () => {
          switchTo('level1');
        }
      ),
      newButton(
        gameWidth / 2 - buttonWidth / 2 - 10,
        200 + sep * 2,
        'Level 2',
        () => {
          switchTo('level2');
        }
      ),
      newButton(
        gameWidth / 2 - buttonWidth / 2 - 10,
        200 + sep * 3,
        'Level 3',
        () => {
          switchTo('level3');
        }
      ),
      newButton(
        gameWidth / 2 - buttonWidth / 2 - 10,
        200 + sep * 4,
        'Level 4',
        () => {
          switchTo('level4');
        }
      ),
      newButton(
        gameWidth / 2 - buttonWidth / 2 - 10,
        200 + sep * 5,
        'Level 5',
        () => {
          switchTo('level5');
        }
      ),
      newButton(gameWidth / 2 - buttonWidth / 2 + 200, 200, 'Level 6', () => {
        switchTo('level6');
      })
    );
  }
}
