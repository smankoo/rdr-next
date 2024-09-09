import React from "react";
import { Article } from "@/app/types";
import { timeAgo } from "@/app/lib/utils";

interface ArticleItemProps {
  article: Article;
  feedName: string; // Add this line
}

export function ArticleItem({ article, feedName }: ArticleItemProps) {
  return (
    <div className="flex space-x-4 p-4 bg-card rounded-lg shadow-sm">
      {article.imageUrl && (
        <img src={article.imageUrl} alt={article.title} className="w-24 h-24 object-cover rounded-md" />
      )}
      <div className="flex-1">
        <h3 className="text-lg font-semibold">{article.title}</h3>
        <p className="text-sm text-muted-foreground">
          <span className="font-medium">{feedName}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span>{timeAgo(article.pubDate)}</span>
        </p>
        <p className="mt-2 text-sm">{article.description?.slice(0, 500) ?? ""}...</p>
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          Read more
        </a>
      </div>
    </div>
  );
}
