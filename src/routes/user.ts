import { Request, Response, Router } from "express";
import { userController } from "../controllers/user";
import jwt from "jsonwebtoken";
import { cookieConfig } from "../config";
import { userSignupInputType } from "../types/userType";
import { verifyToken } from "../utils/jwtUtils";
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
      if (!user.verified) {
        // Redirect the user to the email verification page
        return res.status(200).json({ user });
      }
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
export default router;
