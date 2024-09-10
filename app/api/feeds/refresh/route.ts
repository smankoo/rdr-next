import { NextResponse } from "next/server";
import prisma from "@/app/lib/prisma";
import { fetchFeed } from "@/app/lib/rssFetcher";
import { addArticlesToDatabase } from "@/app/lib/feedUtils";

export async function POST() {
  try {
    // Fetch all feeds from the database
    const feeds = await prisma.feed.findMany();

    for (const feed of feeds) {
      // Fetch and parse the feed
      const parsedFeed = await fetchFeed(feed.url);

      if (parsedFeed) {
        // Add new articles to the database
        await addArticlesToDatabase(parsedFeed.items, feed.id);
      }
    }

    return NextResponse.json({ message: "Feeds refreshed successfully" });
  } catch (error) {
    console.error("Error refreshing feeds:", error);
    return NextResponse.json({ error: "Failed to refresh feeds" }, { status: 500 });
  }
}
