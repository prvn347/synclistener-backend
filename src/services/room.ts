import bcrypt from "bcryptjs";
import { keyType, roomType } from "../types/roomType";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class roomService {
  async createRoom(roomData: roomType, ownerId: number) {
    console.log(Math.random());
    const roomKey = bcrypt.hashSync(Math.random().toString(), 10).slice(10, 16);
    console.log(ownerId, roomData, roomKey, typeof roomKey);
    try {
      const room = await prisma.room.create({
        data: {
          title: roomData.title,
          maxUsers: roomData.maxUsers,
          roomKey,
          ownerId: ownerId,
        },
      });
      console.log("genrated");
      console.log(room);

      return room;
    } catch (error) {
      console.error("Error while creating room:", error);
      throw new Error("error while creating room");
    }
  }

  async findRoom(input: keyType) {
    try {
      console.log(input);
      const room = await prisma.room.findUnique({
        where: {
          roomKey: input.roomKey,
        },
      });
      if (!room) {
        console.error("invalid key");
        throw new Error("invalid room key");
      }
      console.log(room);
      return room;
    } catch (error) {
      console.error("Error while finding room:", error);
      throw new Error("error while finding room");
    }
  }
}
