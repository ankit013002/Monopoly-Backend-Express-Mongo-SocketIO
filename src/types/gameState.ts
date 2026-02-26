import { lastRollType } from "./lastRollType";
import { AllPropertiesType } from "./spaceType";

export type GameState = {
  playerCount: number;
  playerTurnIndex: number;
  allProperties: AllPropertiesType;
  lastRoll: lastRollType;
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
