import { Router, Request, Response } from "express";
import { roomController } from "../controllers/room";
import { AuthRequest, admin } from "../middleware/admin";
const router = Router();

const roomControllers = new roomController();
router.use(admin);
router.post("/create", async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user;
    console.log(ownerId);

    const result = await roomControllers.createRoom(req.body, ownerId);
    if (result instanceof Error) {
      return res.status(403).json({ error: "error while creating room" });
    }
    return res.status(201).json({
      result,
    });
  } catch (error) {
    res.status(403).json({ error: error });
  }
});

export default router;
