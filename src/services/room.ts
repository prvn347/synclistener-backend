import { keyType, roomType } from "../types/roomType";
import { generateSecureKey } from "../config/generateKey";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

export class roomService {
  async createRoom(roomData: roomType, ownerId: number) {
    const key = bcrypt.hashSync(generateSecureKey(), 10);
    const slicedKey = Buffer.from(key, "utf8").toString("base64").slice(10, 20);
    console.log(slicedKey);
    try {
      const room = await prisma.room.create({
        data: {
          title: roomData.title,
          maxUsers: roomData.maxUsers,
          roomKey: slicedKey,
          ownerId: ownerId,
        },
      });

      return room;
    } catch (error) {
      console.error("Error while creating room:", error);
      throw new Error("error while creating room");
    }
  }

  async findRoom(input: keyType, userId: number) {
    try {
      const room = await prisma.room.findUnique({
        where: {
          roomKey: input.roomKey,
        },
      });
      if (!room) {
        console.error("invalid key");
        throw new Error("invalid room key");
      }
      const updateUser = await prisma.room.update({
        where: { roomKey: input.roomKey },
        data: {
          users: {
            connect: { id: userId }, // Assuming you have a user model with relation
          },
        },
      });

      return room;
    } catch (error) {
      console.error("Error while finding room:", error);
      throw new Error("error while finding room");
    }
  }
  async getDetails(roomKey: string) {
    try {
      const room = await prisma.room.findUnique({
        where: {
          roomKey: roomKey,
        },
        select: {
          title: true,
          owner: true,
          users: true,
          maxUsers: true,
        },
      });
      return room;
    } catch (error) {
      console.error("Error while finding room:", error);
      throw new Error("error while finding room");
    }
  }
}
