import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Article, Feed } from "@/app/types";
import ArticleModal from "./ArticleModal";
import { ArticleItem } from "./ArticleItem";

interface ArticleListProps {
  articles: Article[];
  isLoading: boolean;
  feeds: Feed[];
  markArticleAsRead: (articleId: string, isRead?: boolean) => void;
  displayMode: "list" | "grid";
  theme: "modern" | "newspaper"; // Add this line
}

const ARTICLES_PER_PAGE = 10;

const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  isLoading,
  feeds,
  markArticleAsRead,
  displayMode,
  theme,
}) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [displayedArticles, setDisplayedArticles] = useState<Article[]>([]);
  const [page, setPage] = useState(1);
  const { ref, inView } = useInView({
    threshold: 0.5,
  });

  useEffect(() => {
    setDisplayedArticles(articles.slice(0, ARTICLES_PER_PAGE));
  }, [articles]);

  useEffect(() => {
    if (inView && !isLoading) {
      const nextArticles = articles.slice(0, (page + 1) * ARTICLES_PER_PAGE);
      setDisplayedArticles(nextArticles);
      setPage(page + 1);
    }
  }, [inView, isLoading, articles, page]);

  const getFeedName = (feedId: string) => {
    const feed = feeds.find((f) => f.id === feedId);
    return feed ? feed.name : "Unknown Feed";
  };

  const handleArticleClick = (article: Article) => {
    setSelectedArticle(article);
    if (!article.isRead) {
      markArticleAsRead(article.id, true);
    }
  };

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex-grow overflow-y-auto">
        <div className="p-4 md:px-6 lg:px-8 space-y-6">
          {displayedArticles.length > 0 ? (
            <div
              className={`p-4 md:px-6 lg:px-8 ${
                displayMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-6"
              }`}
            >
              {displayedArticles.map((article) => (
                <div key={article.id} role="article" onClick={() => handleArticleClick(article)}>
                  <ArticleItem
                    article={article}
                    feedName={getFeedName(article.feedId)}
                    onTitleClick={() => handleArticleClick(article)}
                    displayMode={displayMode}
                  />
                </div>
              ))}
              {displayedArticles.length < articles.length && (
                <div ref={ref} className="h-10" /> // Intersection observer target
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <svg className="w-24 h-24 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="text-xl font-semibold text-gray-600">No articles found</p>
            </div>
          )}
        </div>
      </div>
      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          theme={theme} // Add this line
        />
      )}
    </div>
  );
};

export default ArticleList;
