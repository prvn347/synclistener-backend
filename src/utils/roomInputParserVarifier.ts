import { ZodError } from "zod";
import { roomInputSchema, roomType } from "../types/roomType";

export class roomInputParserVarifier {
  static roomInputValidation(roomData: roomType) {
    try {
      roomInputSchema.parse(roomData);
    } catch (error) {
      if (error instanceof ZodError) {
        console.error("Validation error for room input:", error.errors);
      } else {
        console.error("Unexpected error while validating room input:", error);
      }
      throw error;
    }
  }
}
