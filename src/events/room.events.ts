import { Server as SocketIOServer } from "socket.io";
import { Socket } from "socket.io";
import { createNewGame, findGame, games } from "../utils/gameIds";
import { TOKEN_COLORS } from "../utils/tokenColors";

let colorIndex = 1;

export const createGame = (socket: Socket, io: SocketIOServer, data: any) => {
  const { player, playerCount } = data;
  console.log(`${player} created a game`);
  const { gameId, gameState } = createNewGame(player, socket.id, playerCount);
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
};

export const joinGame = (socket: Socket, io: SocketIOServer, data: any) => {
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
    color: TOKEN_COLORS[colorIndex],
    balance: 1500,
    ownedSpaces: [],
    position: 0,
  });

  gameState.playerTurnIndex = -1;

  colorIndex += 1;

  socket.emit("join-game-confirmation", {
    message: `Successfuly joined Game with ID: ${gameId}`,
    gameId,
    gameState,
  });

  io.to(gameId.toString()).emit("game-state-update", {
    gameId,
    gameState,
  });
};

export const startGame = (socket: Socket, io: SocketIOServer, data: any) => {
  const { gameId } = data;
  const gameState = findGame(gameId);
  if (!gameState) return;
  if (gameState.players[0].socketId !== socket.id) return;
  console.log(`Inititalizing game state for game: `, gameState);
  gameState.playerTurnIndex = Math.floor(
    Math.random() * gameState.players.length,
  );
  io.to(gameId.toString()).emit("game-started", {
    gameState,
  });
};

export const joinGameRoom = (socket: Socket, io: SocketIOServer, data: any) => {
  const { gameId } = data;
  console.log(`Socket ${socket.id} joining game room ${gameId}`);
  socket.join(gameId.toString());

  // Log all sockets in the room
  const socketsInRoom = io.sockets.adapter.rooms.get(gameId.toString());
  console.log(`Total sockets in room ${gameId}:`, socketsInRoom?.size || 0);
};
