import z, { nullable, number, optional } from "zod";
export interface userSignupInputType {
  email: string;
  username: string;
  name: string;
  password: string;
}
export interface userSigninInputType {
  email: string;
  password: string;
}

export const userTypeSchema = z.object({
  username: z.string(),
  name: z.string(),
  password: z.string(number().min(8)),
  email: z.string().email(),
});
