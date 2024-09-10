import React, { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Article, Feed } from "@/app/types";
import ArticleModal from "./ArticleModal";
import { ArticleItem } from "./ArticleItem";

interface ArticleListProps {
  articles: Article[];
  isLoading: boolean;
  feeds: Feed[];
}

const ARTICLES_PER_PAGE = 10;

const ArticleList: React.FC<ArticleListProps> = ({ articles, isLoading, feeds }) => {
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

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex-grow overflow-y-auto">
        {displayedArticles.length > 0 ? (
          <div className="space-y-6 p-4 md:px-6 lg:px-8">
            {displayedArticles.map((article) => (
              <div key={article.id} onClick={() => setSelectedArticle(article)}>
                <ArticleItem
                  article={article}
                  feedName={getFeedName(article.feedId)}
                  onTitleClick={() => setSelectedArticle(article)}
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
      {selectedArticle && (
        <ArticleModal
          article={{
            ...selectedArticle,
            description: selectedArticle.description || "",
            author: selectedArticle.author ?? undefined,
            imageUrl: selectedArticle.imageUrl ?? undefined,
          }}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
};

export default ArticleList;
