import React, { useState } from "react";
import Image from "next/image";
import { timeAgo } from "@/app/lib/utils";
import ArticleModal from "./ArticleModal";
import { Article, Feed } from "@/app/types";

interface ArticleListProps {
  articles: Article[];
  isLoading: boolean;
  feeds: Feed[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles, isLoading, feeds }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className="flex-grow overflow-y-auto">
        {articles.length > 0 ? (
          <div className="space-y-6 p-4 md:px-6 lg:px-8">
            {articles.map((article) => (
              <div key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden flex">
                {article.imageUrl && (
                  <div className="flex-shrink-0 w-40 h-40">
                    <Image
                      src={article.imageUrl}
                      alt={article.title}
                      width={160}
                      height={160}
                      className="object-cover w-full h-full rounded-md"
                    />
                  </div>
                )}
                <div className="p-4 flex-grow">
                  <h2
                    className="text-xl font-semibold mb-2 cursor-pointer hover:text-blue-600"
                    onClick={() => setSelectedArticle(article)}
                  >
                    {article.title}
                  </h2>
                  <div className="text-sm text-gray-600 mb-2">
                    {article.author && <span className="mr-4">By {article.author}</span>}
                    <span>{timeAgo(article.pubDate)}</span>
                  </div>
                  <p className="text-gray-700 mb-2 line-clamp-2">{article.description}</p>
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Read more
                  </a>
                </div>
              </div>
            ))}
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
