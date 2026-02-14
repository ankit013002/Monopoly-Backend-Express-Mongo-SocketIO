import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { gameIds } from "./utils/gameIds";

interface Player {
  name: string;
}

const sockets = (server: HTTPServer): void => {
  const io: SocketIOServer = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`${socket.id} has joined`);

    socket.on("create-game", (player: Player) => {
      console.log(`${player.name} created a game`);
      const gameId: number = Math.floor(Math.random() * 10000);
      gameIds.push(gameId);
      console.log(gameIds);
      socket.join(gameId.toString());
      socket.emit("confirmation", {
        message: `${gameId} successfully created`,
        gameId: gameId,
      });
    });

    socket.on("join-game", (player: Player) => {});
  });
};

export { sockets };
