import { Request, Response, NextFunction } from "express";
import { gameExists } from "../utils/gameIds";

interface GameExistenceRequest extends Request {
  body: {
    gameId: string;
  };
}

function doesGameExist(
  req: GameExistenceRequest,
  res: Response,
  next: NextFunction,
): Response | void {
  const { gameId } = req.body;

  console.log(gameId);
  console.log("Checking if game exists...");

  if (!gameExists(parseInt(gameId))) {
    console.log("Game does not exist");
    return res.status(400).json({
      message: `Game with id ${gameId} does not exist`,
    });
  }

  next();
}

export { doesGameExist };
