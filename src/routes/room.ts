import { Router, Request, Response } from "express";
import { roomController } from "../controllers/room";
const router = Router();

const roomControllers = new roomController();
router.post("/create", async (req: Request, res: Response) => {
  try {
    const result = await roomControllers.createRoom(req.body);
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
