import express, { Router, Request, Response } from "express";
import { createGame, joinGame } from "../controllers/room.controller";
import { doesGameExist } from "../middleware/gameExistence";

const router: Router = express.Router();

router.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Room Route",
  });
});

router.post("/create", createGame);

router.post("/join", doesGameExist, joinGame);

router.get("/health", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Room healthy",
  });
});

export default router;
