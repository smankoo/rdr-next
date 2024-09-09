import React from "react";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Article, Feed } from "@/app/types";
import { ArticleItem } from "@/app/components/ArticleItem";
import { Spinner } from "@/app/components/ui/spinner";

interface ArticleListProps {
  articles: Article[];
  isLoading: boolean;
  feeds: Feed[]; // Add this line
}

function ArticleList({ articles, isLoading, feeds }: ArticleListProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  if (articles.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {articles.map((article) => {
          const feed = feeds.find((f) => f.id === article.feedId);
          return <ArticleItem key={article.id} article={article} feedName={feed ? feed.name : "Unknown Feed"} />;
        })}
      </div>
    </ScrollArea>
  );
}

export default ArticleList;
