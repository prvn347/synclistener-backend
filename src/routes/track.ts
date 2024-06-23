import { Router, Request, Response } from "express";

const router = Router();

router.post("/search", async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
  } catch (error) {}
});

export default router;
