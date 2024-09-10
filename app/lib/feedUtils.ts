import { Article } from "@/app/types";
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
          content: article.content,
          link: article.link,
          pubDate: new Date(article.pubDate),
          author: article.author || null,
          categories: article.categories || [],
          imageUrl: article.imageUrl || null,
          feedId: feedId,
        },
      });
    }
  }
}
