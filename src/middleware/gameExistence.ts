import { Request, Response, NextFunction } from "express";
import { gameIds } from "../utils/gameIds";

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
  console.log(gameIds);

  if (!gameIds.find((id) => id === parseInt(gameId))) {
    console.log("here");
    return res.status(400).json({
      message: `Game with id ${gameId} does not exist`,
    });
  }

  next();
}

export { doesGameExist };
