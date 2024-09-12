import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
      Referer: "https://www.google.com/",
      DNT: "1",
    };

    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      const articleContent = extractArticleContent(response.data);
      return NextResponse.json({ content: articleContent });
    } else {
      return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in bypassPaywall API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function extractArticleContent(html: string): string {
  const articleRegex = /<article[^>]*>([\s\S]*?)<\/article>/i;
  const match = html.match(articleRegex);
  return match ? match[1] : "";
}
