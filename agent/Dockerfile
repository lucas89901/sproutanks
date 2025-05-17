FROM ubuntu:noble

EXPOSE 18080
WORKDIR /app
ENTRYPOINT [ "build/sproutanks_agent" ]

RUN apt-get update \
  && apt-get install -y g++ cmake libpistache-dev pkg-config

COPY src /app/src
COPY CMakeLists.txt /app/CMakeLists.txt
RUN mkdir -p build \
  && cmake -B build . \
  && cmake --build build -j
