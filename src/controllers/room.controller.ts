import { Request, Response } from "express";
import { gameIds, addGame, createNewGameState } from "../utils/gameIds";

interface CreateGameRequest extends Request {
  body: {
    numberOfPlayers: number;
  };
}

interface JoinGameRequest extends Request {
  body: {
    gameId: string;
  };
}

const createGame = (req: CreateGameRequest, res: Response): void => {
  const { numberOfPlayers } = req.body;

  if (
    !numberOfPlayers ||
    typeof numberOfPlayers !== "number" ||
    numberOfPlayers <= 0
  ) {
    res.status(400).json({
      message: "Valid player count not provided",
    });
    return;
  }

  const gameId: number = Math.floor(Math.random() * 1000);

  // Note: Game state will be created when player connects via socket
  console.log(`GAME ID CREATED: ${gameId}`);

  res.status(200).json({
    message: `Room Created for ${numberOfPlayers} players`,
    gameId,
  });
};

const joinGame = (req: JoinGameRequest, res: Response): void => {
  const { gameId } = req.body;

  console.log(`GAME IDS: ${gameIds}`);

  res.status(200).json({
    message: `Successfully joined Game with ID: ${gameId}`,
  });
};

export { createGame, joinGame };
