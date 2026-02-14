const games: number[] = [];

interface GameState {
  [gameId: string]: {
    players: string[];
  };
}

const gameState: GameState = {
  gameId: {
    players: [],
  },
};

export { games as gameIds, gameState };
