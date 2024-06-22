import express from "express";
import { Prisma } from "@prisma/client";
import dotenv from "dotenv";
import { initialiseRoutes } from "./routes";
const app = express();
dotenv.config();

const port = 3000;
async function startServer() {
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  initialiseRoutes(app);

  app.listen(port, () => {
    console.log(`Server started at port ${port}`);
  });
}

startServer();
