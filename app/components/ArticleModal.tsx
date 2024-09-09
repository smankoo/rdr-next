import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { formatDate } from "@/app/lib/utils";

interface ArticleModalProps {
  article: {
    title: string;
    description: string;
    pubDate: string;
    author?: string;
    imageUrl?: string;
    link: string;
  };
  onClose: () => void;
}

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div ref={modalRef} className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">{article.title}</h2>
          {article.imageUrl && (
            <div className="mb-4">
              <Image
                src={article.imageUrl}
                alt={article.title}
                width={800}
                height={400}
                className="rounded-lg object-cover w-full"
              />
            </div>
          )}
          <div className="text-sm text-gray-600 mb-4">
            {article.author && <span className="mr-4">By {article.author}</span>}
            <span>{formatDate(article.pubDate)}</span>
          </div>
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.description }} />
          <div className="mt-6">
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
              Read full article
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;
