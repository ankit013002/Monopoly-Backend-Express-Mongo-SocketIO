import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { createNewGameState, addGame, games, findGame } from "./utils/gameIds";
import { PlayerType } from "./types/playerType";

const sockets = (server: HTTPServer): void => {
  const io: SocketIOServer = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`${socket.id} has joined`);

    socket.on("create-game", (player: PlayerType) => {
      console.log(`${player.name} created a game`);
      const gameId: number = Math.floor(Math.random() * 10000);
      const gameMap = createNewGameState(gameId, player, socket.id);
      addGame(gameMap);
      console.log("Game created and added to games array");
      socket.join(gameId.toString());
      console.log(games);
      socket.emit("create-game-confirmation", {
        message: `${gameId} successfully created`,
        gameId: gameId,
      });
    });

    socket.on("join-game", (player: PlayerType, gameId: string) => {
      const gameMap = findGame(parseInt(gameId));
      if (!gameMap) {
        socket.emit("join-game-error", {
          message: `Game with ID: ${gameId} does not exist`,
        });
      }

      gameMap?.players.push({
        socketId: socket.id,
        player,
      });

      socket.emit("join-game-confirmation", {
        message: `Successfuly joined Game with ID: ${gameId}`,
        gameId,
        gameMap
      });
    });
  });
};

export { sockets };
