import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { fetchFeed } from "@/app/lib/rssFetcher";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { url, name } = await request.json();

  try {
    const { title: feedTitle, items: feedItems } = await fetchFeed(url);
    const feedName = name || feedTitle || "Unnamed Feed";

    const feed = await prisma.feed.create({
      data: { url, name: feedName },
    });

    for (const item of feedItems) {
      await prisma.article.create({
        data: {
          title: item.title || "",
          link: item.link || "",
          description: item.content || "", // This now contains the cleaned description
          pubDate: new Date(item.pubDate),
          feedId: feed.id,
          imageUrl: item.imageUrl || "",
          author: item.author || "",
        },
      });
    }

    return NextResponse.json(feed);
  } catch (error) {
    console.error("Error adding feed:", error);
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
