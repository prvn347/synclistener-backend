import { Request, Response, Router } from "express";
import { userController } from "../controllers/user";
import jwt from "jsonwebtoken";
import { cookieConfig } from "../config";
import { userSignupInputType } from "../types/userType";
import { verifyToken } from "../utils/jwtUtils";
import { AuthRequest, admin } from "../middleware/admin";
const router = Router();

const userControllers = new userController();

router.post("/signup", async (req: Request, res: Response) => {
  try {
    const result = (await userControllers.createUser(req.body)) as unknown as {
      user: any;
      token: any;
    };

    res.cookie("token", result.token, cookieConfig);

    if (result instanceof Error) {
      return res.status(403).json({ error: "Error while  creating new user" });
    }
    const { user } = result;
    return res.status(201).json({
      user: "user created",
    });
  } catch (error) {
    res.status(403).json({ error: error });
  }
});

router.post("/signin", async (req: Request, res: Response) => {
  try {
    // Parse cookies from the request header
    const cookies = req.headers.cookie;
    console.log(cookies);
    if (!cookies || !cookies.includes("token=")) {
      const result = await userControllers.findUser(req.body);
      if (result instanceof Error) {
        return res.status(403).json({ error: "Error new while finding user" });
      }
      const { user, token } = result as any;

      res.cookie("token", token, cookieConfig);
      return res.status(201).json({ user });
    } else {
      const token = cookies.split("=")[1];
      const verifiedUser = verifyToken(token);
      return res.status(201).json({ user: verifiedUser });
    }
  } catch (error) {
    console.error("Error in /signin route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/protected", admin, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user;
    console.log(userId);
    const result = await userControllers.getUser(parseInt(userId));
    if (result instanceof Error) {
      return res.status(403).json({ error: "Error new while finding user" });
    }
    return res.status(200).json({ user: result });
  } catch (error) {
    console.error("Error in /protented route:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
export default router;
