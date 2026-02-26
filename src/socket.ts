import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import {
  createGame,
  joinGame,
  joinGameRoom,
  startGame,
} from "./events/room.events";
import { pingHealth } from "./events/general.events";
import {
  endTurn,
  handleDiceRoll,
  movePlayer,
  payRent,
  purchaseProperty,
} from "./events/game.events";

const sockets = (server: HTTPServer): void => {
  const io: SocketIOServer = require("socket.io")(server, {
    cors: {
      origin: "http://localhost:3000",
      credentials: false,
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

    socket.on("end-turn", (data) => endTurn(socket, io, data));

    socket.on("purchase-property", (data) =>
      purchaseProperty(socket, io, data),
    );

    socket.on("pay-rent", (data) => payRent(socket, io, data));

    socket.on("dice-roll", (data) => handleDiceRoll(socket, io, data));
  });
};

export { sockets };
