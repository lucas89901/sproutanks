#ifndef AGENT_H_
#define AGENT_H_

#include "nlohmann/json.hpp"

enum ActionType {
  kNone = -1,
  kMove,
  kRotate,
  kFire,
};

enum Direction {
  kUp = 0,
  kDown,
  kLeft,
  kRight,
};

struct Action {
  enum ActionType type;
  Direction direction;
  double angle;
};
NLOHMANN_DEFINE_TYPE_NON_INTRUSIVE(Action, type, direction, angle);

constexpr Action kNoneAction = {.type = kNone, .direction = kUp, .angle = -1};

void InitAgent();
Action GetAction();

#endif  // AGENT_H_
