import { Request, Response, Router } from "express";
import { userController } from "../controllers/user";
import jwt from "jsonwebtoken";
import { cookieConfig } from "../config";
import { userSignupInputType } from "../types/userType";
const router = Router();

const userControllers = new userController();
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const result = (await userControllers.createUser(req.body)) as unknown as {
      user: any;
    };
    const token = jwt.sign(req.body.email, process.env.JWT_SECRET || "secret");
    res.cookie("token", token, cookieConfig);

    if (result instanceof Error) {
      return res.status(403).json({ error: "Error while creating user" });
    }
    const { user } = result;
    return res.status(201).json({
      user: "user created",
    });
  } catch (error) {
    res.status(403).json({ error: error });
  }
});

export default router;
