import { Application } from "express";

import healthRoute from "./health";
import userRoute from "./user";
export const initialiseRoutes = (app: Application) => {
  app.use("/health", healthRoute);
  app.use("/user", userRoute);
};
