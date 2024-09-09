import { NextResponse } from "next/server";
import { addSSEClient } from "@/app/lib/sseHandler";

export async function GET() {
  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder();
      const send = (data: string) => {
        controller.enqueue(encoder.encode(data));
      };

      addSSEClient({
        write: send,
        end: () => controller.close(),
      });

      // Keep the connection alive
      const interval = setInterval(() => {
        send(": keepalive\n\n");
      }, 30000);

      return () => {
        clearInterval(interval);
      };
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
