#ifndef GAME_H_
#define GAME_H_

#include <vector>

struct Pos {
  int x, y;

  Pos() = default;
  Pos(int x, int y) : x(x), y(y) {}
};

struct Tank {
  Pos pos;
  double angle;
};

enum BlockType {
  kEmpty = 0,
  kWall,
  kPlayer,
  kEnemy,
};

class Game {
 public:
  Game(const Game&) = delete;
  Game& operator=(const Game&) = delete;
  Game(Game&&) = delete;
  Game& operator=(Game&&) = delete;

  static Game* GetInstance();

  void Init(int level, int rows, int cols, const Tank& player_tank,
            const std::vector<Tank>& enemy_tanks,
            const std::vector<Pos>& walls);
  void Update(const Tank& player_tank, const std::vector<Tank>& enemy_tanks);

  void PrintGame() const;
  void PrintGrid() const;

  int level() const;
  int rows() const;
  int cols() const;
  Tank player_tank() const;
  std::vector<Tank> enemy_tanks() const;
  std::vector<Pos> walls() const;
  std::vector<std::vector<BlockType>> grid() const;

 private:
  Game() = default;

  static Game* instance_;

  int level_;
  int rows_;
  int cols_;
  Tank player_tank_;
  std::vector<Tank> enemy_tanks_;
  std::vector<Pos> walls_;
  std::vector<std::vector<BlockType>> grid_;
};

#endif  // GAME_H_
