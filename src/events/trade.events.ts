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

  const fromPlayer = gameState.players.find((p) => p.socketId === socket.id);
  const toPlayer = gameState.players.find((p) => p.socketId === tradeOffer.to);

  if (!fromPlayer || !toPlayer) {
    console.log("Invalid trade request: one or both players are not in the game");
    return;
  }

  const sanitizedTradeOffer: TradeType = {
    ...tradeOffer,
    from: socket.id,
    to: toPlayer.socketId,
  };

  io.to(toPlayer.socketId).emit("trade-offer", sanitizedTradeOffer);

  console.log(
    `Trade offer forwarded from ${sanitizedTradeOffer.from} to ${sanitizedTradeOffer.to}`,
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

  if (socket.id !== trade.to) {
    console.log(`Unauthorized accept-trade attempt by ${socket.id}`);
    return;
  }

  const fromPlayer = gameState.players.find((p) => p.socketId === trade.from);
  const toPlayer = gameState.players.find((p) => p.socketId === trade.to);

  if (!fromPlayer || !toPlayer) {
    console.log("One or both players not found for trade");
    return;
  }

  const offerMoney = trade.offer.money;
  const requestMoney = trade.request.money;

  if (
    !Number.isFinite(offerMoney) || offerMoney < 0 ||
    !Number.isFinite(requestMoney) || requestMoney < 0
  ) {
    console.log("Invalid money amounts in trade offer");
    return;
  }

  if (fromPlayer.balance < offerMoney || toPlayer.balance < requestMoney) {
    console.log("Insufficient funds for trade");
    return;
  }

  for (const propId of trade.offer.properties) {
    if (!fromPlayer.ownedSpaces.includes(propId)) {
      console.log(`fromPlayer does not own property ${propId}`);
      return;
    }
  }

  for (const propId of trade.request.properties) {
    if (!toPlayer.ownedSpaces.includes(propId)) {
      console.log(`toPlayer does not own property ${propId}`);
      return;
    }
  }

  fromPlayer.balance -= offerMoney;
  toPlayer.balance += offerMoney;
  toPlayer.balance -= requestMoney;
  fromPlayer.balance += requestMoney;

  trade.offer.properties.forEach((propId) => {
    fromPlayer.ownedSpaces = fromPlayer.ownedSpaces.filter((id) => id !== propId);
    if (!toPlayer.ownedSpaces.includes(propId)) {
      toPlayer.ownedSpaces.push(propId);
    }

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
    if (!fromPlayer.ownedSpaces.includes(propId)) {
      fromPlayer.ownedSpaces.push(propId);
    }

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
  const { gameId, trade } = data;

  const gameIdNum = parseInt(gameId);
  const gameState = findGame(gameIdNum);
  if (!gameState) {
    console.log("Game state not found for game ID: " + gameId);
    return;
  }

  if (socket.id !== trade.to) {
    console.log(
      `Unauthorized trade decline attempt by ${socket.id} for trade to ${trade.to}`,
    );
    return;
  }

  const fromPlayer = gameState.players.find((p) => p.socketId === trade.from);
  const toPlayer = gameState.players.find((p) => p.socketId === trade.to);

  if (!fromPlayer || !toPlayer) {
    console.log("One or both players not found for trade");
    return;
  }

  io.to(trade.from).emit("trade-declined", { by: trade.to });

  console.log(`Trade declined: ${trade.to} declined offer from ${trade.from}`);
};
