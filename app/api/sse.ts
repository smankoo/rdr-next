import { NextApiRequest, NextApiResponse } from "next";
import { addSSEClient } from "../lib/sseHandler";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  addSSEClient(res);

  req.on("close", () => {
    res.end();
  });
}
