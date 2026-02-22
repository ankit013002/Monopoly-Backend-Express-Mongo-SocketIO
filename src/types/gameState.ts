import { AllPropertiesType, SpaceType } from "./spaceType";

export type GameState = {
  playerCount: number;
  playerTurnIndex: number;
  allProperties: AllPropertiesType;
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
