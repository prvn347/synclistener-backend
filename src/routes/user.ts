import { Request, Response, Router } from "express";
import { userController } from "../controllers/user";

const router = Router();

const user = new userController();
router.post("/signup", async (req: Request, res: Response) => {
  try {
    const result = (await user.createUser(req.body)) as unknown as {
      user: any;
    };
    if (result instanceof Error) {
      return res.status(403).json({ error: "Error while creating user" });
    }
    return res.json({ result });
  } catch (error) {
    res.status(403).json({ error: error });
  }
});

export default router;
