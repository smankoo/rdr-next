import { NextApiRequest, NextApiResponse } from "next";
import { fetchFeedContent } from "../lib/rssFetcher";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      const { url } = req.body;
      const feedItems = await fetchFeedContent(url);
      res.status(200).json(feedItems);
    } catch (error) {
      res.status(500).json({ error: "Error fetching feed" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
