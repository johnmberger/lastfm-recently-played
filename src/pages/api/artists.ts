import { NextApiRequest, NextApiResponse } from "next";
import { getWeeklyArtists } from "@/lib/lastfm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const artists = await getWeeklyArtists();
    console.log("/api/artists success", { count: artists.length });
    res.status(200).json(artists);
  } catch (error) {
    const err = error as any;
    console.error("/api/artists error", {
      message: err?.message,
      stack: err?.stack,
    });
    res.status(500).json({ message: "Failed to fetch weekly artists" });
  }
}
