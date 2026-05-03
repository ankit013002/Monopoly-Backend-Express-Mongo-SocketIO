import { lastRollType } from "./lastRollType";
import { AllSpacesType } from "./spaceType";
import { PlayerType } from "./playerType";
import { CardType } from "./cardType";

export type GameState = {
  playerCount: number;
  playerTurnIndex: number;
  allSpaces: AllSpacesType;
  chanceCards: CardType[];
  communityCards: CardType[];
  lastRoll: lastRollType;
  players: PlayerType[];
};
