import express, { Application, Request, Response } from "express";
import cors from "cors";
import roomRoutes from "./routes/room.routes";

const app: Application = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "hello world",
  });
});

app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Healthy",
  });
});

app.use("/room", roomRoutes);

export default app;
