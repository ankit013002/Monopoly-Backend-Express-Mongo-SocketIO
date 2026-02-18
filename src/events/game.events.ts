import { Server as SocketIOServer } from "socket.io";
import { Socket } from "socket.io";
import { findGame } from "../utils/gameIds";

export const movePlayer = (socket: Socket, io: SocketIOServer, data: any) => {
  const { gameId, playerId, steps } = data;
  const gameData = findGame(gameId);
  if (!gameData) {
    socket.broadcast.emit("error", {
      message: "Error making move",
    });
  }

  gameData?.players.find(
    (player) => player.socketId === playerId && player.position + 1,
  );

  socket.to(gameId.toString()).emit("game-state", gameData);
};
