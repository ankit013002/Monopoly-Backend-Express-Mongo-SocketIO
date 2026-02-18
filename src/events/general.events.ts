import { Server as SocketIOServer } from "socket.io";
import { Socket } from "socket.io";
import { findGame } from "../utils/gameIds";

export const pingHealth = (socket: Socket, io: SocketIOServer, data: any) => {
  const { gameId } = data;
  const gameData = findGame(gameId);
  console.log(
    `Ping received from ${gameData?.players.find((player) => player.socketId === socket.id)} for game`,
    gameId,
  );

  io.to(gameId.toString()).emit("ping-health-response", {
    message: "Server healthy",
    from: socket.id,
  });
};
