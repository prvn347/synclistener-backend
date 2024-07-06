import { WebSocketServer, WebSocket } from "ws";
interface Room {
  [key: string]: WebSocket[];
}
let rooms: Room = {};
console.log(rooms);

export default rooms;
