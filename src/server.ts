import mongoose from "mongoose";
import app from "./app";
import { sockets } from "./socket";
import "dotenv/config";

async function connectToDB(): Promise<void> {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
  } catch (err) {
    console.error(`Error connecting to DB: ${err}`);
    process.exit(1);
  }
}

connectToDB();

const PORT: string | number = process.env.PORT || 5001;

const server = app.listen(PORT, () =>
  console.log(`Server listening on: ${PORT}`),
);

console.log("Ready tp recieve socket communication");

sockets(server);
