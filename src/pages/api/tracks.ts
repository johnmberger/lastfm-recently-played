import { NextApiRequest, NextApiResponse } from "next";
import { getRecentTracks } from "@/lib/lastfm";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const tracks = await getRecentTracks();
    console.log("/api/tracks success", { count: tracks.length });
    res.status(200).json(tracks);
  } catch (error) {
    const err = error as any;
    console.error("/api/tracks error", {
      message: err?.message,
      stack: err?.stack,
    });
    res.status(500).json({ message: "Failed to fetch tracks" });
  }
}
