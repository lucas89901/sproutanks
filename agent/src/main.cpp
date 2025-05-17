#include <csignal>
#include <iostream>
#include <memory>

#include "agent.h"
#include "game.h"
#include "nlohmann/json.hpp"
#include "pistache/endpoint.h"
#include "pistache/router.h"

namespace {

Game& game = *Game::GetInstance();
std::unique_ptr<Pistache::Http::Endpoint> server = nullptr;

void Options(const Pistache::Rest::Request& request,
             Pistache::Http::ResponseWriter response) {
  response.headers().add<Pistache::Http::Header::AccessControlAllowOrigin>("*");
  response.headers().add<Pistache::Http::Header::AccessControlAllowMethods>(
      "POST, OPTIONS");
  response.headers().add<Pistache::Http::Header::AccessControlAllowHeaders>(
      "Content-Type");
  response.send(Pistache::Http::Code::Ok);
}

void Init(const Pistache::Rest::Request& request,
          Pistache::Http::ResponseWriter response) {
  // Parse the JSON body
  nlohmann::json json = nlohmann::json::parse(request.body());
#ifdef API_DEBUG
  std::cerr << "/init request: " << json.dump() << std::endl;
#endif  // API_DEBUG
  std::string level = json["level"].get<std::string>();
  int rows = json["rows"].get<int>();
  int cols = json["cols"].get<int>();
  std::vector<Pos> walls;
  for (const auto& wall : json["walls"]) {
    walls.emplace_back(wall["x"].get<int>(), wall["y"].get<int>());
  }

  Tank player_tank = {.pos = Pos(json["playerTank"]["x"].get<int>(),
                                 json["playerTank"]["y"].get<int>()),
                      .angle = json["playerTank"]["angle"].get<double>()};
  std::vector<Tank> enemy_tanks;
  for (const auto& enemy_tank : json["enemyTanks"]) {
    Tank tank = {
        .pos = Pos(enemy_tank["x"].get<int>(), enemy_tank["y"].get<int>()),
        .angle = enemy_tank["angle"].get<double>()};
    enemy_tanks.push_back(tank);
  }
  game.Init(level.back() - '0', rows, cols, player_tank, enemy_tanks, walls);

  InitAgent();
  response.headers().add<Pistache::Http::Header::ContentType>(
      Pistache::Http::Mime::MediaType("application/json"));
  response.headers().add<Pistache::Http::Header::AccessControlAllowOrigin>("*");
  response.send(Pistache::Http::Code::Ok, "OK");
}

void Update(const Pistache::Rest::Request& request,
            Pistache::Http::ResponseWriter response) {
  nlohmann::json json = nlohmann::json::parse(request.body());
#ifdef API_DEBUG
  std::cerr << "/update request: " << json.dump() << std::endl;
#endif

  Tank player_tank = {.pos = Pos(json["playerTank"]["x"].get<int>(),
                                 json["playerTank"]["y"].get<int>()),
                      .angle = json["playerTank"]["angle"].get<double>()};
  std::vector<Tank> enemy_tanks;
  for (const auto& enemy_tank : json["enemyTanks"]) {
    Tank tank = {
        .pos = Pos(enemy_tank["x"].get<int>(), enemy_tank["y"].get<int>()),
        .angle = enemy_tank["angle"].get<double>()};
    enemy_tanks.push_back(tank);
  }
  game.Update(player_tank, enemy_tanks);

  response.headers().add<Pistache::Http::Header::ContentType>(
      Pistache::Http::Mime::MediaType("application/json"));
  response.headers().add<Pistache::Http::Header::AccessControlAllowOrigin>("*");

  auto response_json = nlohmann::json(GetAction());
#ifdef API_DEBUG
  std::cerr << "/update response: " << response_json.dump() << std::endl;
#endif
  response.send(Pistache::Http::Code::Ok, response_json.dump());
}

}  // namespace

void SignalHandler(int signal) {
  if (signal == SIGINT || signal == SIGTERM) {
    std::cerr << "Received signal, shutting down server..." << std::endl;
    server->shutdown();
    exit(0);
  }
}

int main() {
  signal(SIGINT, SignalHandler);
  signal(SIGTERM, SignalHandler);

  Pistache::Rest::Router router;
  Pistache::Rest::Routes::Options(router, "/init",
                                  Pistache::Rest::Routes::bind(&Options));
  Pistache::Rest::Routes::Options(router, "/update",
                                  Pistache::Rest::Routes::bind(&Options));
  Pistache::Rest::Routes::Post(router, "/init",
                               Pistache::Rest::Routes::bind(&Init));
  Pistache::Rest::Routes::Post(router, "/update",
                               Pistache::Rest::Routes::bind(&Update));

  Pistache::Address addr(Pistache::Ipv4::any(), Pistache::Port(18080));
  auto opts = Pistache::Http::Endpoint::options().threads(1).flags(
      Pistache::Tcp::Options::ReuseAddr | Pistache::Tcp::Options::ReusePort);
  server = std::make_unique<Pistache::Http::Endpoint>(addr);
  server->init(opts);
  std::cerr << "Server listening on " << addr.host() << ":" << addr.port()
            << std::endl;
  std::cerr << "Press Ctrl+C to stop the server." << std::endl;
  server->setHandler(router.handler());
  server->serve();
  return 0;
}
