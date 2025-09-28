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
    res.status(200).json(tracks);
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ message: "Failed to fetch tracks" });
  }
}
