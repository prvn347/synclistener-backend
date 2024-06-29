import axios from "axios";
import { Router, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const router = Router();

router.get("/search", async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    console.log(query);
    if (!query) {
      return res.status(400).json({ error: "Query parameter is required" });
    }

    const response = await axios.get(
      "https://www.googleapis.com/youtube/v3/search",
      {
        params: {
          part: "snippet",
          q: query,
          key: process.env.YOUTUBE_API_KEY,
          maxResults: 10,
        },
      }
    );

    res.status(200).json(response.data);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Failed to fetch data from YouTube API" });
  }
});

export default router;
