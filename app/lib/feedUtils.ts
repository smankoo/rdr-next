import { Article } from "../types";

export async function fetchArticles(): Promise<Article[]> {
  const response = await fetch("/api/articles");
  if (!response.ok) {
    throw new Error("Failed to fetch articles");
  }
  const articles = await response.json();
  return articles.map((article: any) => ({
    ...article,
    pubDate: new Date(article.pubDate),
    content: article.content || article.description || "",
    categories: article.categories as string[] | null,
  }));
}
