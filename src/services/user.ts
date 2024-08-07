import { userSigninInputType, userSignupInputType } from "../types/userType";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { generateToken } from "../utils/jwtUtils";
const prisma = new PrismaClient();
export class userService {
  async createUser(userData: userSignupInputType) {
    try {
      const hashedPassword = await bcrypt.hashSync(userData.password, 10);
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
        },
      });

      const token = generateToken(user.id);

      return { user, token };
    } catch (error) {
      return new Error("error while db user creation");
    }
  }
  async findUser(userData: userSigninInputType) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          email: userData.email,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      const isValidPassword = await bcrypt.compare(
        userData.password,
        user?.password || ""
      );
      if (!isValidPassword) {
        throw new Error("wrong password");
      }
      if (isValidPassword) {
        const token = generateToken(user.id);
        return { user, token };
      }
    } catch (error) {
      throw new Error("error while finding user");
    }
  }
  async waitlist(email: { email: string }) {
    try {
      const room = await prisma.waitlist.create({
        data: {
          email: email.email,
        },
      });
      console.log(room);
      return room;
    } catch (error) {
      console.error("Error while creating room:", error);
      throw new Error("error while creating room");
    }
  }
  async getUserRooms(ownerId: number) {
    try {
      console.log("reached service");
      console.log(ownerId);
      const userRooms = await prisma.room.findMany({
        where: {
          ownerId: ownerId,
        },
      });
      console.log(userRooms);
      return userRooms;
    } catch (error) {
      console.error("Error while creating room:", error);
      throw new Error("error while creating room");
    }
  }
  async getUser(userId: number) {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
        select: {
          name: true,
          ownedRooms: true,
        },
      });

      return user;
    } catch (error) {
      throw new Error("unautherized user");
    }
  }
}
