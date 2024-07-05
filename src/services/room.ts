import bcrypt from "bcryptjs";
import { keyType, roomType } from "../types/roomType";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export class roomService {
  async createRoom(roomData: roomType, ownerId: number) {
    console.log(Math.random());

    console.log(ownerId, roomData);
    try {
      const room = await prisma.room.create({
        data: {
          title: roomData.title,
          maxUsers: roomData.maxUsers,
          roomKey: roomData.roomKey,
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

  async findRoom(input: keyType, userId: number) {
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
      const updateUser = await prisma.room.update({
        where: { roomKey: input.roomKey },
        data: {
          users: {
            connect: { id: userId }, // Assuming you have a user model with relation
          },
        },
      });
      console.log(room);
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
