import z, { ZodError, nullable, number, optional } from "zod";
import { userSignupInputType, userTypeSchema } from "../types/userType";

export class userInputParserVarifier {
  static validateUserSignupInput(userDate: userSignupInputType) {
    try {
      userTypeSchema.parse(userDate);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Validation error for user input:", error.errors);
      } else {
        console.error("Unexpected error while validating user input:", error);
      }
      throw error;
    }
  }
  static validateUserSigninInput(input: userSignupInputType): void {
    try {
      userTypeSchema.parse(input);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Validation error for user input:", error.errors);
      } else {
        console.error("Unexpected error while validating user input:", error);
      }
      throw error;
    }
  }
}
