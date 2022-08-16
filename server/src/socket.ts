import { Server, Socket } from "socket.io";
import crypto from "crypto";
import http from "http";
import logger from "./logger";

interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

interface ClientToServerEvents {
  createRoom: () => void;
  joinRoom: (roomId: string) => void;
}

interface InterServerEvents {}
interface SocketData {}

let io: Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
> | null;

const corsOptions =
  process.env.NODE_ENV === "production"
    ? {}
    : { origin: "http://localhost:3000" };

function createRoom(this: Socket) {
  const roomId = crypto.pseudoRandomBytes(8).toString("hex");
  this.join(roomId);
  this.emit("roomCreated", roomId);
}

function joinRoom(this: Socket, roomId: string) {
  if (!roomId || !io?.sockets.adapter.rooms.get(roomId))
    this.emit("roomJoined", false);

  this.emit("roomJoined", true);
}

export function setUpSocket(httpServer: http.Server) {
  io = new Server(httpServer, {
    cors: corsOptions,
  });

  io.on("connection", (socket) => {
    socket.on("createRoom", createRoom);
    socket.on("joinRoom", joinRoom);
  });

  logger.info("Socket Server Setup Complete");
}
