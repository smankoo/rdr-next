import React from "react";
import { Article } from "@/app/types";
import { timeAgo } from "@/app/lib/utils";

interface ArticleItemProps {
  article: Article;
  feedName: string;
  onTitleClick: () => void;
}

export function ArticleItem({ article, feedName, onTitleClick }: ArticleItemProps) {
  return (
    <div className="flex space-x-4 p-4 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-300 cursor-default">
      {article.imageUrl && (
        <div className="article-image-container w-40 h-40 flex-shrink-0 overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="article-image w-full h-full object-cover rounded-md"
          />
        </div>
      )}
      <div className="flex-1 flex flex-col">
        <h2 className="text-lg font-semibold text-gray-800 mb-2 hover:text-blue-600 transition-colors duration-200 cursor-default">
          {article.title}
        </h2>
        <p className="text-sm text-gray-600 mb-2 cursor-default">
          <span className="font-medium">{feedName}</span>
          <span className="mx-2 text-gray-400">•</span>
          <span>{timeAgo(article.pubDate)}</span>
        </p>
        <p className="mt-2 text-sm text-gray-700 line-clamp-3 cursor-default">{article.description}</p>
        <div className="flex-grow"></div>
        <div className="mt-2">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-800 transition-all duration-300 ease-in-out group"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span className="border-b border-transparent group-hover:border-indigo-800 transition-all duration-300 ease-in-out">
              Read more
            </span>
            <svg
              className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
