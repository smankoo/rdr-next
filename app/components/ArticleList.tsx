import React from "react";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Article } from "@/app/types";
import { ArticleItem } from "@/app/components/ArticleItem";

interface ArticleListProps {
  articles: Article[];
}

export function ArticleList({ articles }: ArticleListProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {articles.map((article) => (
          <ArticleItem key={article.id} article={article} />
        ))}
      </div>
    </ScrollArea>
  );
}
