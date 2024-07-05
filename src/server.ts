import express from "express";
import { Prisma } from "@prisma/client";
import dotenv from "dotenv";
import { initialiseRoutes } from "./routes";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import bcrypt from "bcryptjs";
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
  const maxClients = 4;
  interface Room {
    [key: string]: WebSocket[];
  }
  let rooms: Room = {};
  wss.on(
    "connection",
    function connection(ws: WebSocket, request: any, client: any) {
      ws.on("error", console.error);

      ws.on("message", function message(message: string) {
        try {
          console.log(`Received message ${message} from user ${client}`);
          const data = JSON.parse(message);
          const type: string = data.type;
          const params = data.params;
          switch (type) {
            case "create":
              createRoom(ws, params);
              break;
            case "join":
              joinRoom(ws, params);
              break;
            case "leave":
              leaveRoom(ws);
              break;
            case "play":
            case "pause":
            case "seek":
              broadcastToRoom(ws, data);
              break;

            default:
              console.warn(`Unknown message type: ${type}`);
          }
        } catch (error) {}
        ///here you will write you logic for application it could be sending to server sendin data form server and room server etc.
        // wss.clients.forEach(function each(client) {
        //   if (client !== ws && client.readyState === WebSocket.OPEN) {
        //     client.send(data, { binary: isbinery });
        //   }
        // });
      });
      ws.on("close", () => {
        leaveRoom(ws);
      });
    }
  );
  function createRoom(
    ws: WebSocket,
    params: {
      title: string;
      roomKey: string;
      maxUsers: number;
    }
  ): void {
    const room: any = params.roomKey;
    rooms[room] = [ws];
    (ws as any).room = room;
    sendMessage(ws, {
      type: "info",
      params: { room, clients: rooms[room].length },
    });
  }

  function joinRoom(ws: WebSocket, params: { code: string }): void {
    const room = params.code;
    if (!rooms[room]) {
      console.warn(`Room ${room} does not exist`);
      return;
    }

    if (rooms[room].length >= maxClients) {
      console.warn(`Room ${room} is full`);
      return;
    }

    rooms[room].push(ws);
    (ws as any).room = room;
    sendMessage(ws, {
      type: "info",
      params: { room, clients: rooms[room].length },
    });
  }

  function leaveRoom(ws: WebSocket): void {
    const room = (ws as any).room;
    if (!room) return;

    rooms[room] = rooms[room].filter((client) => client !== ws);
    (ws as any).room = null;

    if (rooms[room].length === 0) {
      delete rooms[room];
    }
  }
  function broadcastToRoom(sender: WebSocket, message: any): void {
    const room = (sender as any).room;
    if (!room || !rooms[room]) return;

    rooms[room].forEach((client) => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  function sendMessage(ws: WebSocket, message: any) {
    ws.send(JSON.stringify(message));
  }

  // function generateRoomCode(length: number) {
  //   let result = "";

  //   result = bcrypt.hashSync(Math.random().toString(), 10).slice(10, 20);

  //   return result;
  // }
}

startServer();
