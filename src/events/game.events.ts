import { Server as SocketIOServer } from "socket.io";
import { Socket } from "socket.io";
import { findGame, updateGame } from "../utils/gameIds";

export const movePlayer = (socket: Socket, io: SocketIOServer, data: any) => {
  const { newGameState, gameId } = data;

  const gameIdNum = parseInt(gameId);

  console.log(typeof gameId);
  console.log(typeof newGameState);
  console.log("GAMEID: " + gameId);
  console.log("newGameState: " + newGameState);

  const gameState = updateGame(gameIdNum, newGameState);

  console.log(gameState);

  if (gameState) {
    io.to(gameIdNum.toString()).emit("game-state-update", {
      gameId: gameIdNum,
      gameState,
    });
  } else {
    console.log("GAME STATE DOES NOT EXIST");
  }
};
