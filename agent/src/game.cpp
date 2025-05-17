#include "game.h"

#include <iostream>
#include <string>

#include "nlohmann/json.hpp"

Game* Game::instance_ = nullptr;

Game* Game::GetInstance() {
  if (!instance_) {
    instance_ = new Game();
  }
  return instance_;
}

void Game::Init(int level, int rows, int cols, const Tank& player_tank,
                const std::vector<Tank>& enemy_tanks,
                const std::vector<Pos>& walls) {
  level_ = level;
  rows_ = rows;
  cols_ = cols;
  grid_ = std::vector<std::vector<BlockType>>(
      rows, std::vector<BlockType>(cols, kEmpty));

  player_tank_ = player_tank;
  enemy_tanks_ = enemy_tanks;
  walls_ = walls;
  grid_[player_tank.pos.y][player_tank.pos.x] = kPlayer;
  for (const auto& enemy_tank : enemy_tanks) {
    grid_[enemy_tank.pos.y][enemy_tank.pos.x] = kEnemy;
  }
  for (const auto& wall : walls) {
    grid_[wall.y][wall.x] = kWall;
  }

  std::cerr << "Game initialized: "
            << "level=" << level << ", rows=" << rows << ", cols=" << cols
            << ", player_tank=(" << player_tank.pos.x << ","
            << player_tank.pos.y << ", angle=" << player_tank.angle << "), "
            << std::endl;
}

void Game::Update(const Tank& player_tank,
                  const std::vector<Tank>& enemy_tanks) {
  for (int y = 0; y < rows_; ++y) {
    for (int x = 0; x < cols_; ++x) {
      if (grid_[y][x] == kPlayer || grid_[y][x] == kEnemy) {
        grid_[y][x] = kEmpty;
      }
    }
  }
  grid_[player_tank.pos.y][player_tank.pos.x] = kPlayer;
  player_tank_ = player_tank;
  enemy_tanks_ = enemy_tanks;

  for (const auto& enemy_tank : enemy_tanks) {
    grid_[enemy_tank.pos.y][enemy_tank.pos.x] = kEnemy;
  }
}

void Game::PrintGame() const {
  std::cout << "Level: " << level_ << std::endl;
  std::cout << "Rows: " << rows_ << ", Cols: " << cols_ << std::endl;
  std::cout << "Player Tank Position: (" << player_tank_.pos.x << ", "
            << player_tank_.pos.y << "), Angle: " << player_tank_.angle
            << std::endl;
  std::cout << "Enemy Tanks:" << std::endl;
  for (size_t i = 0; i < enemy_tanks_.size(); ++i) {
    std::cout << " [" << i << "]: " << "Position: (" << enemy_tanks_[i].pos.x
              << ", " << enemy_tanks_[i].pos.y
              << "), Angle: " << enemy_tanks_[i].angle << std::endl;
  }
  std::cout << std::endl;
}

void Game::PrintGrid() const {
  std::cout << "------------ Grid ------------" << std::endl;
  for (const auto& row : grid_) {
    for (const auto& cell : row) {
      switch (cell) {
        case kEmpty:
          std::cout << '.';
          break;
        case kWall:
          std::cout << '#';
          break;
        case kPlayer:
          std::cout << 'P';
          break;
        case kEnemy:
          std::cout << 'E';
          break;
        default:
          std::cout << '?';
          break;
      }
      std::cout << ' ';
    }
    std::cout << std::endl;
  }
  std::cout << "------------------------------" << std::endl;
}

int Game::level() const {
  return level_;
}
int Game::rows() const {
  return rows_;
}
int Game::cols() const {
  return cols_;
}
Tank Game::player_tank() const {
  return player_tank_;
}
std::vector<Tank> Game::enemy_tanks() const {
  return enemy_tanks_;
}
std::vector<Pos> Game::walls() const {
  return walls_;
}
std::vector<std::vector<BlockType>> Game::grid() const {
  return grid_;
}
