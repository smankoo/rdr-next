import { NextApiResponse } from "next";

interface SSEClient {
  write: (data: string) => void;
  end: () => void;
}

const clients: Set<SSEClient> = new Set();

export function addSSEClient(client: SSEClient) {
  clients.add(client);
  client.write("connected\n\n");
}

export function emitSSEEvent(event: string, data: any) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach((client) => {
    client.write(payload);
  });
}
