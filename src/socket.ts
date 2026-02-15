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

    socket.on("start-game", (data) => {
      const { gameId } = data;
      const gameState = findGame(gameId);
      if (!gameState) return;
      if (gameState.players[0].socketId !== socket.id) return; // only host can start
      io.to(gameId.toString()).emit("game-started", {
        gameId,
        playerCount: gameState.playerCount,
      });
    });

    socket.on("join-game-room", (data) => {
      const { gameId } = data;
      console.log(`Socket ${socket.id} joining game room ${gameId}`);
      socket.join(gameId.toString());

      // Log all sockets in the room
      const socketsInRoom = io.sockets.adapter.rooms.get(gameId.toString());
      console.log(`Total sockets in room ${gameId}:`, socketsInRoom?.size || 0);
    });

    socket.on("ping-health", (data) => {
      const { gameId } = data;
      const gameData = findGame(gameId);
      console.log(
        `Ping received from ${gameData?.players.find((player) => player.socketId === socket.id)} for game`,
        gameId,
      );

      // Send to everyone in the room INCLUDING the sender
      io.to(gameId.toString()).emit("ping-health-response", {
        message: "Server healthy",
        from: socket.id,
      });
    });
  });
};

export { sockets };
