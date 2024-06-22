import { CookieOptions } from "express";

export const cookieConfig: CookieOptions = {
  maxAge: 10000 * 60 * 15,
  httpOnly: true,
  sameSite: process.env.NODE_ENV == "dev" ? "lax" : "none",
  secure: process.env.NODE_ENV == "dev" ? false : true,
};
