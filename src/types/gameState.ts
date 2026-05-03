import { lastRollType } from "./lastRollType";
import { AllSpacesType } from "./spaceType";
import { PlayerType } from "./playerType";

export type GameState = {
  playerCount: number;
  playerTurnIndex: number;
  allSpaces: AllSpacesType;
  lastRoll: lastRollType;
  players: PlayerType[];
};
