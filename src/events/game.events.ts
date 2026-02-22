import { Server as SocketIOServer } from "socket.io";
import { Socket } from "socket.io";
import { findGame, updateGame } from "../utils/gameIds";
import { SpaceType } from "../types/spaceType";

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

export const endTurn = (socket: Socket, io: SocketIOServer, data: any) => {
  const { gameId } = data;

  const gameIdNum = parseInt(gameId);
  const gameState = findGame(gameIdNum);

  if (!gameState) {
    console.log("Game state not found for game ID: " + gameId);
    return;
  }

  gameState.playerTurnIndex =
    (gameState.playerTurnIndex + 1) % gameState.players.length;

  io.to(gameIdNum.toString()).emit("game-state-update", {
    gameId: gameIdNum,
    gameState,
  });
};

export const purchaseProperty = (
  socket: Socket,
  io: SocketIOServer,
  data: any,
) => {
  const gameId = data.gameId as string;
  const property = data.property as SpaceType;
  const gameIdNum = parseInt(gameId);
  const gameState = findGame(gameIdNum);

  if (!gameState) {
    console.log("Game state not found for game ID: " + gameId);
    return;
  }

  gameState.players.map((player) => {
    if (player.socketId === socket.id) {
      if (!property.price) {
        console.log("Property price not found for property ID: " + property.id);
        return;
      }
      player.ownedSpaces.push(property.id);
      player.balance -= property.price;
    }
  });

  Object.values(gameState.allProperties).forEach((propertyArray) => {
    propertyArray.forEach((space) => {
      if (space.id === property.id) {
        space.ownedBy = {
          socketId: socket.id,
          name: gameState.players.find(
            (player) => player.socketId === socket.id,
          )?.name as string,
          color: gameState.players.find(
            (player) => player.socketId === socket.id,
          )?.color as string,
        };
      }
    });
  });

  io.to(gameIdNum.toString()).emit("game-state-update", {
    gameId: gameIdNum,
    gameState,
  });
};
