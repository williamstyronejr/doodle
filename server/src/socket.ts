import { Server } from "socket.io";
import http from "http";
import logger from "./logger";

export function setUpSocket(httpServer: http.Server) {
  const io = new Server(httpServer);

  logger.info("Socket Server Setup Complete");
}
