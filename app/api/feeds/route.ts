import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Parser from "rss-parser";

const prisma = new PrismaClient();
const parser = new Parser();

export async function POST(request: Request) {
  const { url, name } = await request.json();

  try {
    const parsedFeed = await parser.parseURL(url);
    const feedName = name || parsedFeed.title || "Unnamed Feed";

    const feed = await prisma.feed.create({
      data: { url, name: feedName },
    });

    for (const item of parsedFeed.items) {
      await prisma.article.create({
        data: {
          title: item.title || "",
          link: item.link || "",
          description: item.contentSnippet || "",
          pubDate: item.isoDate ? new Date(item.isoDate) : new Date(),
          feedId: feed.id,
          imageUrl: item.enclosure?.url || item["media:content"]?.$.url || "",
        },
      });
    }

    return NextResponse.json(feed);
  } catch (error) {
    return NextResponse.json({ error: "Failed to add feed" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const feeds = await prisma.feed.findMany({
      include: {
        articles: {
          orderBy: { pubDate: "desc" },
          take: 20,
        },
      },
    });
    return NextResponse.json(feeds);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch feeds" }, { status: 500 });
  }
}
