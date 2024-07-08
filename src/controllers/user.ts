import { userSigninInputType, userSignupInputType } from "../types/userType";
import { userService } from "../services/user";
import { userInputParserVarifier } from "../utils/userInputParser&Varifier";

export class userController {
  userInputParserVarifier = new userInputParserVarifier();
  userService = new userService();

  async createUser(userData: userSignupInputType) {
    try {
      userInputParserVarifier.validateUserSignupInput(userData);
      return await this.userService.createUser(userData);
    } catch (error) {
      return new Error("error while creating user.");
    }
  }
  async waitlist(email: { email: string }) {
    try {
      userInputParserVarifier.validateUserWaitlist(email);
      return await this.userService.waitlist(email);
    } catch (error) {
      return new Error("error while waitlisting  user.");
    }
  }

  async findUser(userData: userSigninInputType) {
    try {
      userInputParserVarifier.validateUserSigninInput(userData);
      return await this.userService.findUser(userData);
    } catch (error) {
      return new Error("error while creating user.");
    }
  }
  async getUser(userId: number) {
    try {
      return await this.userService.getUser(userId);
    } catch (error) {
      return new Error("error while getting user.");
    }
  }
}
