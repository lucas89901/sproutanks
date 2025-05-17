cmake_minimum_required(VERSION 3.15)
project("Sproutanks!! Agent")
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

cmake_policy(SET CMP0135 NEW)

find_package(PkgConfig)
pkg_check_modules(Pistache REQUIRED IMPORTED_TARGET libpistache)

include(FetchContent)
FetchContent_Declare(json URL https://github.com/nlohmann/json/releases/download/v3.12.0/json.tar.xz)
FetchContent_MakeAvailable(json)

add_executable(
  sproutanks_agent
  src/agent.cpp
  src/game.cpp
  src/main.cpp
)
target_link_libraries(
  sproutanks_agent
  PkgConfig::Pistache
  nlohmann_json::nlohmann_json
)
