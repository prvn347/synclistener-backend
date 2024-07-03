import { roomService } from "../services/room";
import { keyType, roomType } from "../types/roomType";
import { roomInputParserVarifier } from "../utils/roomInputParserVarifier";

export class roomController {
  roomservice = new roomService();
  roomInputParserVarifier = new roomInputParserVarifier();
  async createRoom(roomData: roomType, ownerId: number) {
    try {
      roomInputParserVarifier.roomInputValidation(roomData);
      return await this.roomservice.createRoom(roomData, ownerId);
    } catch (error) {
      return new Error("error while creating room.");
    }
  }

  async findRoom(inputKey: keyType, userId: number) {
    try {
      return await this.roomservice.findRoom(inputKey, userId);
    } catch (error) {
      return new Error("error while validating key");
    }
  }
  async getDetails(inputKey: string) {
    try {
      return await this.roomservice.getDetails(inputKey);
    } catch (error) {
      return new Error("error while validating key");
    }
  }
}
