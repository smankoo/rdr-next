import React from "react";
import { Article } from "@/app/types";
import { timeAgo, calculateReadingTime, decodeHTMLEntities } from "@/app/lib/utils";
import Image from "next/image";
import DOMPurify from "dompurify";

interface ArticleItemProps {
  article: Article;
  feedName: string;
  onTitleClick: () => void;
  displayMode: "list" | "grid";
}

export const ArticleItem: React.FC<ArticleItemProps> = ({ article, feedName, onTitleClick, displayMode }) => {
  const readingTime = calculateReadingTime(article.description ?? "");
  const decodedDescription = decodeHTMLEntities(article.description ?? "");

  // Create a sanitized version of the HTML
  const sanitizedDescription = DOMPurify.sanitize(decodedDescription, {
    ADD_ATTR: ["target", "rel"], // Allow target and rel attributes
  });

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden ${displayMode === "grid" ? "flex flex-col" : "flex"}`}
    >
      {article.imageUrl && (
        <div className={`${displayMode === "grid" ? "w-full h-48" : "w-1/4 h-auto"}`}>
          <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className={`${displayMode === "grid" ? "p-4" : "flex-1 p-4"}`}>
        <h2
          className="text-xl font-bold text-gray-800 mb-3 hover:text-indigo-600 transition-colors duration-200 cursor-pointer"
          // onClick={onTitleClick}
        >
          {article.title}
        </h2>
        <p className="text-sm text-gray-500 mb-3 flex items-center">
          <span className="font-semibold text-indigo-600">{feedName}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span>{timeAgo(article.pubDate)}</span>
          <span className="mx-2 text-gray-300">•</span>
          <span>{readingTime}</span>
          <span className="mx-2 text-gray-300">•</span>
          {article.isRead ? (
            <>
              <span className="w-2 h-2 bg-gray-400 rounded-full mr-1 inline-block"></span>
              {/* <span>Read</span> */}
            </>
          ) : (
            <>
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1 inline-block"></span>
              {/* <span>Unread</span> */}
            </>
          )}
        </p>
        <div
          className="mt-2 text-base text-gray-600 line-clamp-3 article-description [&_a]:text-indigo-600 [&_a]:hover:text-indigo-800 [&_a]:hover:underline"
          dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
        />
        <div className="flex-grow"></div>
        <div className="mt-4">
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-all duration-300 ease-in-out group"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <span className="border-b-2 border-transparent group-hover:border-indigo-600 transition-all duration-300 ease-in-out">
              Read more
            </span>
            <svg
              className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300 ease-in-out"
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
};

// Remove the ArticleItemStyles export
