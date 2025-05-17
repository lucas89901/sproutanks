#include "agent.h"

#include <cmath>
#include <iostream>
#include <queue>
#include <vector>

#include "game.h"

static Game& game = *Game::GetInstance();

// TODO: You may add or modify global variables as needed.
static std::queue<Action> actions;

// TODO: You may add or modify functions as needed.
void PrintSomeDebugMessages() {
  // ...
}

void InitLevel0() {
  actions.push({.type = kMove, .direction = kDown});
  actions.push({.type = kMove, .direction = kDown});
  actions.push({.type = kRotate, .angle = 0});
  actions.push({.type = kFire});
}

// TODO: Calculate the actions for levels 1-4.
void InitLevel1() {
  // ...
}
void InitLevel2() {
  // ...
}
void InitLevel3() {
  // ...
}
void InitLevel4() {
  // ...
}

void InitAgent() {
  actions = {};
  if (game.level() == 0) {
    InitLevel0();
  }
  // TODO: Handle levels 1-4.
}

Action GetAction() {
  // TODO: Special case: Handle level 5.

  // game.PrintGame();
  if (!actions.empty()) {
    // TODO: Return front of actions queue.
  }
  return kNoneAction;
}
