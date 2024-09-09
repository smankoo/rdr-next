import { NextResponse } from "next/server";
import prisma from "../../lib/prisma";
import { fetchFeed } from "../../lib/rssFetcher";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const feedId = searchParams.get("feedId");

  try {
    let articles;

    if (feedId) {
      const feed = await prisma.feed.findUnique({
        where: { id: feedId },
        include: { articles: true },
      });

      if (!feed) {
        return NextResponse.json({ error: "Feed not found" }, { status: 404 });
      }

      if (feed.articles.length === 0) {
        // If no articles, fetch them
        const fetchedArticles = await fetchFeed(feed.url);
        await prisma.article.createMany({
          data: fetchedArticles.map((article) => ({
            ...article,
            feedId: feed.id,
          })),
        });

        // Fetch the newly created articles
        articles = await prisma.article.findMany({
          where: { feedId: feed.id },
        });
      } else {
        articles = feed.articles;
      }
    } else {
      // If no feedId is provided, fetch all articles
      articles = await prisma.article.findMany();
    }

    return NextResponse.json(articles);
  } catch (error) {
    console.error("Error fetching articles:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
