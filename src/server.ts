import express from "express";
import { Prisma } from "@prisma/client";
import dotenv from "dotenv";
import { initialiseRoutes } from "./routes";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
const app = express();
dotenv.config();

const port = 3001;
async function startServer() {
  app.use(express.json());

  app.use(express.urlencoded({ extended: false }));

  app.use(
    cors({
      credentials: true,
      origin: true,
      allowedHeaders: ["Content-Type", "Authorization", "Cookies"],

      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
  );
  app.options(
    "*",
    cors({
      credentials: true,
      origin: true,
      allowedHeaders: ["Content-Type", "Authorization", "Cookies"],

      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    })
  );
  initialiseRoutes(app);

  const server = app.listen(port, () => {
    console.log(`Server started at port ${port}`);
  });
  const wss = new WebSocketServer({ server: server });
  wss.on(
    "connection",
    function connection(ws: import("ws"), request: any, client: any) {
      ws.on("error", console.error);

      ws.on("message", function message(data, isbinery) {
        console.log(`Received message ${data} from user ${client}`);
        ///here you will write you logic for application it could be sending to server sendin data form server and room server etc.
        wss.clients.forEach(function each(client) {
          if (client !== ws && client.readyState === WebSocket.OPEN) {
            client.send(data, { binary: isbinery });
          }
        });
      });
    }
  );
}

startServer();
