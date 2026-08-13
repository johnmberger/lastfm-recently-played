import { NextApiRequest, NextApiResponse } from "next";
import { getWeeklyTops } from "@/lib/lastfm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const payload = await getWeeklyTops();
    console.log("/api/top-this-week success", {
      artists: payload.artists.length,
      albums: payload.albums.length,
      tracks: payload.tracks.length,
    });
    res.status(200).json(payload);
  } catch (error) {
    const err = error as any;
    console.error("/api/top-this-week error", {
      message: err?.message,
      stack: err?.stack,
    });
    res.status(500).json({ message: "Failed to fetch top this week" });
  }
}
