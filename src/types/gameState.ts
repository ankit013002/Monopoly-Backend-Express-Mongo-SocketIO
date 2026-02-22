import { SpaceType } from "./spaceType";

export type GameState = {
  playerCount: number;
  playerTurnIndex: number;
  allProperties: SpaceType[];
  players: [
    {
      socketId: string;
      name: string;
      color: string;
      balance: number;
      ownedSpaces: number[];
      position: number;
    },
  ];
};
