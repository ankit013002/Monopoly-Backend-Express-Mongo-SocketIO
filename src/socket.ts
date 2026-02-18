import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { addGame, games, findGame, createNewGame } from "./utils/gameIds";
import { PlayerType } from "./types/playerType";
import {
  createGame,
  joinGame,
  joinGameRoom,
  startGame,
} from "./events/room.events";
import { pingHealth } from "./events/general.events";
import { movePlayer } from "./events/game.events";

const sockets = (server: HTTPServer): void => {
  const io: SocketIOServer = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`${socket.id} has joined`);

    socket.on("create-game", (data) => createGame(socket, io, data));

    socket.on("join-game", (data) => joinGame(socket, io, data));

    socket.on("start-game", (data) => startGame(socket, io, data));

    socket.on("join-game-room", (data) => joinGameRoom(socket, io, data));

    socket.on("ping-health", (data) => pingHealth(socket, io, data));

    socket.on("move-token", (data) => movePlayer(socket, io, data));
  });
};

export { sockets };
