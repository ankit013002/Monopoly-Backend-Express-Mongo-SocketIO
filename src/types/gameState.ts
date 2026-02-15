import { PlayerType } from "./playerType";

export type GameState = {
  playerCount: number;
  players: [
    {
      socketId: string;
      name: string;
    },
  ];
};
