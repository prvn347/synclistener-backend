import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { initialiseRoutes } from "./routes";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import bcrypt from "bcryptjs";
const app = express();
const prisma = new PrismaClient();

dotenv.config();

const port = 3001;
interface Room {
  [key: string]: WebSocket[]; // Explicitly allow undefined for uninitialized rooms
}

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
  const existingRooms = await prisma.room.findMany({});
  let rooms: Room = {};
  existingRooms.forEach((room) => {
    rooms[room.roomKey] = []; // Initialize empty array for existing rooms
  });
  console.log("loadded ropom" + JSON.stringify(rooms));

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
            case "videoId":
              broadcastToRoom(ws, data);
              break;
            default:
              console.warn(`Unknown message type: ${type}`);
          }
        } catch (error) {
          console.error(error);
        }
      });

      ws.on("close", () => {
        leaveRoom(ws);
      });
    }
  );

  async function createRoom(
    ws: WebSocket,
    params: { title: string; roomKey: string; maxUsers: number }
  ) {
    const roomKey = params.roomKey;

    // Check for existing room before creating a new one
    const existingRoom = await prisma.room.findUnique({
      where: { roomKey },
    });

    if (existingRoom) {
      console.warn(`Room with key ${roomKey} already exists`);
      sendMessage(ws, {
        type: "error",
        params: { message: "Room already exists" },
      });
      return;
    } // Normalize room key
    try {
      // Create a new room in the database using Prisma

      rooms[roomKey] = [ws]; // Add the connecting user to the room
      (ws as any).room = roomKey;
      console.log(`Room created: ${roomKey}`);
      sendMessage(ws, {
        type: "info",
        params: { room: roomKey, clients: rooms[roomKey].length },
      });
    } catch (error) {
      console.error("Error creating room:", error);
    }
  }

  function joinRoom(ws: WebSocket, params: { code: string }) {
    console.log("jonig room" + JSON.stringify(rooms));

    const roomCode = params.code; // Normalize room code
    console.log(`Attempting to join room with code: ${roomCode}`);
    if (!rooms[roomCode]) {
      console.warn(`Room ${roomCode} does not exist`);
      return;
    }

    if (rooms[roomCode].length >= maxClients) {
      console.warn(`Room ${roomCode} is full`);
      return;
    }

    rooms[roomCode].push(ws);
    (ws as any).room = roomCode;
    sendMessage(ws, {
      type: "info",
      params: { room: roomCode, clients: rooms[roomCode].length },
    });
  }

  function leaveRoom(ws: WebSocket) {
    const room = (ws as any).room;
    if (!room) return;

    rooms[room] = rooms[room].filter((client) => client !== ws);
    (ws as any).room = null;

    if (rooms[room].length === 0) {
      delete rooms[room];
    }
  }

  function broadcastToRoom(sender: WebSocket, message: any) {
    const room = (sender as any).room;
    console.log(`Broadcasting to room: ${room}`);
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
}

startServer();
