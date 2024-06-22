import { roomService } from "../services/room";
import { roomType } from "../types/roomType";
import { roomInputParserVarifier } from "../utils/roomInputParserVarifier";

export class roomController {
  roomservice = new roomService();
  roomInputParserVarifier = new roomInputParserVarifier();
  async createRoom(roomData: roomType) {
    try {
      roomInputParserVarifier.roomInputValidation(roomData);
      return await this.roomservice.createRoom(roomData);
    } catch (error) {
      return new Error("error while creating room.");
    }
  }
}
