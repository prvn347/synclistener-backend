import bcrypt from "bcryptjs";
import { roomType } from "../types/roomType";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class roomService {
  async createRoom(roomData: roomType, ownerId: number) {
    const roomKey = bcrypt.hashSync(Math.random().toString(), 8);

    try {
      const room = await prisma.room.create({
        data: {
          title: roomData.title,
          roomKey: roomKey,
          maxUsers: roomData.maxUsers,
          ownerId: ownerId,
        },
      });
      console.log(room);

      return room;
    } catch (error) {
      throw new Error("error while creating room");
    }
  }
}
