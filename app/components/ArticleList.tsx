import React, { useState } from "react";
import Image from "next/image";
import { timeAgo } from "@/app/lib/utils";
import ArticleModal from "./ArticleModal";

interface Article {
  id: string;
  title: string;
  description: string;
  pubDate: string;
  author?: string;
  imageUrl?: string;
  link: string;
}

interface ArticleListProps {
  articles: Article[];
}

const ArticleList: React.FC<ArticleListProps> = ({ articles }) => {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  return (
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
      {selectedArticle && <ArticleModal article={selectedArticle} onClose={() => setSelectedArticle(null)} />}
    </div>
  );
};

export default ArticleList;
