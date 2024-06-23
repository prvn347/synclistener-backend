import { Application } from "express";

import healthRoute from "./health";
import userRoute from "./user";
import roomRoute from "./room";
import trackRoute from "./track";
export const initialiseRoutes = (app: Application) => {
  app.use("/health", healthRoute);
  app.use("/user", userRoute);
  app.use("/room", roomRoute);
  app.use("/track", trackRoute);
};
