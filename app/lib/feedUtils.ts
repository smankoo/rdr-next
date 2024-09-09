import { Article } from "@/app/types";

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
