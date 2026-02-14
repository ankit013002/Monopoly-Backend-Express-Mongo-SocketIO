import { PlayerType } from "../types/playerType";

export type Games = Map<number, GameState>[];

export const games: Games = [];

interface GameState {
  players: [
    {
      socketId: string;
      player: PlayerType;
    },
  ];
}

const createNewGameState = (
  gameId: number,
  player: PlayerType,
  socketId: string,
): Map<number, GameState> => {
  const gameState: GameState = {
    players: [
      {
        socketId,
        player,
      },
    ],
  };

  const gameMap = new Map<number, GameState>();
  gameMap.set(gameId, gameState);

  return gameMap;
};

const addGame = (gameMap: Map<number, GameState>): void => {
  games.push(gameMap);
};

const findGame = (gameId: number): GameState | undefined => {
  for (const gameMap of games) {
    if (gameMap.has(gameId)) {
      return gameMap.get(gameId);
    }
  }
  return undefined;
};

const gameExists = (gameId: number): boolean => {
  return findGame(gameId) !== undefined;
};

export { games as gameIds, createNewGameState, addGame, findGame, gameExists };
