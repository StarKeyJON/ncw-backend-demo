import morgan from "morgan";
import cors from "cors";
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import { AuthOptions, checkJwt } from "./middleware/jwt";
import { UserController } from "./controllers/user.controller";
import { UserService } from "./services/user.service";
import { Clients } from "./interfaces/Clients";
import { errorHandler } from "./middleware/errorHandler";
import { createPassphraseRoute } from "./routes/passphrase.route";
import { Server as SocketIOServer } from "socket.io";
import { jwtVerify } from "jose";
import { createTradeRoutes } from "./routes/trade.route";

const logger = morgan("combined");

export const visibilityTimeout = 120_000;
export const waitForTransactionTimeout = 10_000;

function createApp(
  authOpts: AuthOptions,
  clients: Clients,
): { app: express.Express; socketIO: SocketIOServer } {
  const validateUser = checkJwt(authOpts);
  const tradeRoute = createTradeRoutes(clients);
  const passphraseRoute = createPassphraseRoute();
  const userContoller = new UserController(new UserService());

  const app: Express = express();

  app.use(logger);

  app.use(
    cors({
      origin,
      maxAge: 600,
    }),
  );

  app.use(bodyParser.json({ limit: "50mb" }));

  app.get("/", (req: Request, res: Response) => res.send("OK"));

  app.post("/api/login", validateUser, userContoller.login.bind(userContoller));
  app.use("/api/passphrase", validateUser, passphraseRoute);
  app.use("/api/trade", validateUser, tradeRoute);

  app.use(errorHandler);

  const socketIO = new SocketIOServer();

  socketIO.on("connection", async (socket) => {
    const token = socket.handshake?.auth?.token;
    const { verify, key } = authOpts;

    try {
      if (!token) {
        throw new Error("no token provided");
      }

      const payload = await jwtVerify(token, key, verify);
      socket.handshake.auth.payload = payload;
    } catch (e) {
      console.error("failed authenticating socket", e);
      socket.disconnect(true);
      return;
    }
  });

  return { app, socketIO };
}

export { createApp };
