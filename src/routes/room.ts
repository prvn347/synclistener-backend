import { Router, Request, Response, query } from "express";
import { roomController } from "../controllers/room";
import { AuthRequest, admin } from "../middleware/admin";
const router = Router();

const roomControllers = new roomController();
router.use(admin);
router.post("/create", async (req: AuthRequest, res: Response) => {
  try {
    const ownerId = req.user;

    const result = await roomControllers.createRoom(
      req.body,
      parseInt(ownerId)
    );
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

router.post("/join", async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user;
    const result = await roomControllers.findRoom(req.body, parseInt(userId));
    if (result instanceof Error) {
      return res.status(403).json({ error: "error while fin_ding room" });
    }
    return res.status(201).json({
      result,
    });
  } catch (error) {
    res.status(403).json({ error: error });
  }
});
router.get("/details", async (req: Request, res: Response) => {
  try {
    const result = await roomControllers.getDetails(req.query.q as string);
    if (result instanceof Error) {
      return res.status(403).json({ error: "error while fin_ding room" });
    }
    return res.status(201).json({
      result,
    });
  } catch (error) {
    res.status(403).json({ error: error });
  }
});

export default router;
