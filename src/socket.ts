import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { addGame, games, findGame, createNewGame } from "./utils/gameIds";
import { PlayerType } from "./types/playerType";

const sockets = (server: HTTPServer): void => {
  const io: SocketIOServer = require("socket.io")(server, {
    cors: {
      origin: "*",
    },
  });

  io.on("connection", (socket) => {
    console.log(`${socket.id} has joined`);

    socket.on("create-game", (data) => {
      const { player, playerCount } = data;
      console.log(`${player} created a game`);
      const { gameId, gameState } = createNewGame(
        player,
        socket.id,
        playerCount,
      );
      console.log(`Game created and added to games array: `);
      Array.from(games).forEach((game) => {
        console.log(game);
      });
      socket.join(gameId.toString());
      socket.emit("create-game-confirmation", {
        message: `${gameId} successfully created`,
        gameId,
        gameState,
      });
    });

    socket.on("join-game", (data) => {
      const { player, gameIdString } = data;

      const gameId = parseInt(gameIdString);

      console.log(`GAME ID: ${gameId}`);
      const gameState = findGame(gameId);

      console.log(gameState);
      if (!gameState) {
        socket.emit("join-game-error", {
          message: `Game with ID: ${gameId} does not exist`,
        });
        return;
      }

      socket.join(gameId.toString());

      gameState.players.push({
        socketId: socket.id,
        name: player,
      });

      console.log(gameState);

      socket.emit("join-game-confirmation", {
        message: `Successfuly joined Game with ID: ${gameId}`,
        gameId,
        gameState,
      });

      io.to(gameId.toString()).emit("game-state-update", {
        gameId,
        gameState,
      });
    });
  });
};

export { sockets };
