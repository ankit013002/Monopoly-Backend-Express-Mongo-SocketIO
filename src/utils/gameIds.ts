import { GameState } from "../types/gameState";
import { PlayerType } from "../types/playerType";

export type Games = Map<number, GameState>;

export const games: Games = new Map();

const createNewGame = (
  player: string,
  socketId: string,
  playerCount: number,
): { gameId: Number; gameState: GameState } => {
  const gameId: number = Math.floor(Math.random() * 10000);

  const gameState: GameState = {
    playerCount,
    players: [
      {
        socketId,
        name: player,
      },
    ],
  };

  addGame(gameId, gameState);

  return {
    gameId,
    gameState,
  };
};

const addGame = (gameId: number, gameState: GameState): void => {
  games.set(gameId, gameState);
};

const findGame = (gameId: number): GameState | undefined => {
  console.log(`INPUT ID: ${gameId}`);
  console.log("GAMES:");
  Array.from(games).forEach((game) => {
    console.log(game);
  });
  if (games.has(gameId)) {
    return games.get(gameId);
  }
  return undefined;
};

export { games as gameIds, createNewGame, addGame, findGame };
