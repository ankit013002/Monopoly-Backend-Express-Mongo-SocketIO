import { CardType } from "../types/cardType";
import { GameState } from "../types/gameState";
import { AllSpacesType, SpaceType } from "../types/spaceType";
import { TOKEN_COLORS } from "./tokenColors";

export type Games = Map<number, GameState>;

export const games: Games = new Map();

const createNewGame = (
  player: string,
  socketId: string,
  playerCount: number,
  allSpaces: AllSpacesType,
  chanceCards: CardType[],
  communityCards: CardType[],
): { gameId: Number; gameState: GameState } => {
  const gameId: number = Math.floor(Math.random() * 10000);

  const gameState: GameState = {
    playerCount,
    playerTurnIndex: -1,
    allSpaces,
    chanceCards,
    communityCards,
    lastRoll: {
      d1: 0,
      d2: 0,
      total: 0,
    },
    players: [
      {
        socketId,
        name: player,
        color: TOKEN_COLORS[0],
        balance: 1500,
        ownedSpaces: [],
        position: 0,
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
    console.log(`Game with ID: ${gameId} found`);
    return games.get(gameId);
  }
  return undefined;
};

export const updateGame = (
  gameId: number,
  gameState: GameState,
): GameState | undefined => {
  games.set(gameId, gameState);
  return games.get(gameId);
};

export { games as gameIds, createNewGame, addGame, findGame };
