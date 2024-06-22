import { userSignupInputType } from "../types/userType";
import { userService } from "../services/user";
export class userController {
  userService = new userService();
  async createUser(userData: userSignupInputType) {
    try {
      return await this.userService.createUser(userData);
    } catch (error) {
      return new Error("error while creating user.");
    }
  }
}
