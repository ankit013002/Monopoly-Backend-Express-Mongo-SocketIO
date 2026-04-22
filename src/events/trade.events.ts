import { Server as SocketIOServer } from "socket.io";
import { Socket } from "socket.io";
import { TradeType } from "../types/tradeType";
import { findGame } from "../utils/gameIds";

export const requestTrade = (
  socket: Socket,
  io: SocketIOServer,
  data: { gameId: string; tradeOffer: TradeType },
) => {
  const { gameId, tradeOffer } = data;

  const gameIdNum = parseInt(gameId);
  const gameState = findGame(gameIdNum);
  if (!gameState) {
    console.log("Game state not found for game ID: " + gameId);
    return;
  }

  // Forward offer directly to the recipient
  io.to(tradeOffer.to).emit("trade-offer", tradeOffer);

  console.log(
    `Trade offer forwarded from ${tradeOffer.from} to ${tradeOffer.to}`,
  );
};

export const acceptTrade = (
  socket: Socket,
  io: SocketIOServer,
  data: { gameId: string; trade: TradeType },
) => {
  const { gameId, trade } = data;

  const gameIdNum = parseInt(gameId);
  const gameState = findGame(gameIdNum);
  if (!gameState) {
    console.log("Game state not found for game ID: " + gameId);
    return;
  }

  const fromPlayer = gameState.players.find((p) => p.socketId === trade.from);
  const toPlayer = gameState.players.find((p) => p.socketId === trade.to);

  if (!fromPlayer || !toPlayer) {
    console.log("One or both players not found for trade");
    return;
  }

  fromPlayer.balance -= trade.offer.money;
  toPlayer.balance += trade.offer.money;
  toPlayer.balance -= trade.request.money;
  fromPlayer.balance += trade.request.money;

  trade.offer.properties.forEach((propId) => {
    fromPlayer.ownedSpaces = fromPlayer.ownedSpaces.filter(
      (id) => id !== propId,
    );
    toPlayer.ownedSpaces.push(propId);

    Object.values(gameState.allProperties).forEach((arr) => {
      arr.forEach((space) => {
        if (space.id === propId) {
          space.ownedBy = {
            socketId: toPlayer.socketId,
            name: toPlayer.name,
            color: toPlayer.color,
          };
        }
      });
    });
  });

  trade.request.properties.forEach((propId) => {
    toPlayer.ownedSpaces = toPlayer.ownedSpaces.filter((id) => id !== propId);
    fromPlayer.ownedSpaces.push(propId);

    Object.values(gameState.allProperties).forEach((arr) => {
      arr.forEach((space) => {
        if (space.id === propId) {
          space.ownedBy = {
            socketId: fromPlayer.socketId,
            name: fromPlayer.name,
            color: fromPlayer.color,
          };
        }
      });
    });
  });

  io.to(gameIdNum.toString()).emit("game-state-update", {
    gameId: gameIdNum,
    gameState,
  });

  console.log(`Trade accepted between ${trade.from} and ${trade.to}`);
};

export const declineTrade = (
  socket: Socket,
  io: SocketIOServer,
  data: { gameId: string; trade: TradeType },
) => {
  const { trade } = data;

  io.to(trade.from).emit("trade-declined", { by: trade.to });

  console.log(`Trade declined: ${trade.to} declined offer from ${trade.from}`);
};
