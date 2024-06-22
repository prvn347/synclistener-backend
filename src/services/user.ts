import { userSignupInputType } from "../types/userType";

import { PrismaClient } from "@prisma/client/edge";
const prisma = new PrismaClient();
export class userService {
  async createUser(userData: userSignupInputType) {
    try {
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          username: userData.username,
          email: userData.email,
          password: userData.password,
        },
      });

      return user;
    } catch (error) {
      return new Error("error while db user creation");
    }
  }
}
