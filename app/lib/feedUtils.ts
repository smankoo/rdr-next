import { Article, Feed } from "@/app/types";
import prisma from "@/app/lib/prisma";
import { FeedItem } from "@/app/lib/rssFetcher";

export async function fetchArticles(feedId?: string): Promise<Article[]> {
  try {
    const url = feedId ? `/api/articles?feedId=${feedId}` : "/api/articles";
    const response = await fetch(url);
    if (!response.ok) throw new Error("Failed to fetch articles");
    return await response.json();
  } catch (error) {
    console.error("Error fetching articles:", error);
    throw error;
  }
}

export async function addArticlesToDatabase(articles: FeedItem[], feedId: string) {
  for (const article of articles) {
    // Check if the article already exists in the database
    const existingArticle = await prisma.article.findFirst({
      where: {
        link: article.link,
        feedId: feedId,
      },
    });

    // If the article doesn't exist, add it to the database
    if (!existingArticle) {
      await prisma.article.create({
        data: {
          title: article.title,
          description: article.description || "", // Add fallback
          link: article.link,
          pubDate: new Date(article.pubDate),
          author: article.author || null,
          imageUrl: article.imageUrl || null,
          feedId: feedId,
        },
      });
    }
  }
}

export async function fetchFeeds(): Promise<Feed[]> {
  try {
    const response = await fetch("/api/feeds");
    if (!response.ok) throw new Error("Failed to fetch feeds");
    return await response.json();
  } catch (error) {
    console.error("Error fetching feeds:", error);
    throw error;
  }
}

export async function addFeed(url: string, name: string): Promise<Feed> {
  try {
    const response = await fetch("/api/feeds", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, name }),
    });
    if (!response.ok) throw new Error("Failed to add feed");
    return await response.json();
  } catch (error) {
    console.error("Error adding feed:", error);
    throw error;
  }
}

export async function deleteFeed(feedId: string): Promise<void> {
  try {
    const response = await fetch(`/api/feeds/${feedId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Failed to delete feed");
  } catch (error) {
    console.error("Error deleting feed:", error);
    throw error;
  }
}

export async function updateFeed(id: string, url: string, name: string): Promise<void> {
  try {
    const response = await fetch(`/api/feeds/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, name }),
    });
    if (!response.ok) throw new Error("Failed to update feed");
  } catch (error) {
    console.error("Error updating feed:", error);
    throw error;
  }
}
