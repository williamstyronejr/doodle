import http from "http";
import express from "express";
import logger from "./logger";
import { setUpSocket } from "./socket";
import path from "path";

const BUILD_PATH =
  process.env.NODE_ENV === "production"
    ? path.join(__dirname, "..", "..", "..", "client", "build")
    : path.join(__dirname, "..", "..", "client", "build");

export async function startServer(IP: string, PORT: number) {
  const app = express();
  const httpServer = http.createServer(app);
  setUpSocket(httpServer);

  app.use("/static", express.static(path.join(BUILD_PATH, "static")));

  // Default to react app in build folder
  app.use("/*", (req, res, next) => {
    try {
      res.sendFile(path.join(BUILD_PATH, "index.html"));
    } catch (err) {
      logger.error("Production build is missing");
      return res.status(404).send("<div>404 Page</div>");
    }
  });

  await new Promise<void>((res) => {
    httpServer.listen({ host: IP, port: PORT }, res);
  });

  logger.info(`Server started at ${IP}:${PORT}`);
}
