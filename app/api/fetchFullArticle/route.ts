import { NextRequest, NextResponse } from "next/server";
import { extract } from "@extractus/article-extractor";

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const article = await extract(url);
    return NextResponse.json({ content: article.content });
  } catch (error) {
    console.error("Error extracting article:", error);
    return NextResponse.json({ error: "Failed to extract article" }, { status: 500 });
  }
}
