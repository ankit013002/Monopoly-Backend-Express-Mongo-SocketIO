import { Request, Response, NextFunction } from "express";

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

  next();
}

export { doesGameExist };
