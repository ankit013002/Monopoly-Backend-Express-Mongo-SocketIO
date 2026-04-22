import { Server as SocketIOServer } from "socket.io";
import { Socket } from "socket.io";
import { findGame, updateGame } from "../utils/gameIds";
import { lastRollType } from "../types/lastRollType";

export const requestTrade = (
  socket: Socket,
  io: SocketIOServer,
  data: any,
) => {};
