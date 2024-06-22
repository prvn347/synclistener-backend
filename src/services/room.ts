import bcrypt from "bcryptjs";
import { roomType } from "../types/roomType";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class roomService {
  async createRoom(roomData: roomType) {
    const roomKey = bcrypt.hashSync(Math.random().toString(), 8);
    try {
      const room = await prisma.room.create({
        data: {
          title: roomData.title,
          roomKey: roomKey,
          maxUsers: roomData.maxUsers,
        },
      });

      return room;
    } catch (error) {
      throw new Error("error while creating room");
    }
  }
}
