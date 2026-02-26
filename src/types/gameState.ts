import { AllPropertiesType, SpaceType } from "./spaceType";

export type GameState = {
  playerCount: number;
  playerTurnIndex: number;
  allProperties: AllPropertiesType;
  lastRoll: {
    d1: number;
    d2: number;
    total: number;
  };
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
