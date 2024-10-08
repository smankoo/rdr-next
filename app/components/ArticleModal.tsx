import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { formatDate } from "@/app/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import DOMPurify from "isomorphic-dompurify";
import { bypassPaywall } from "@/app/lib/bypassPaywall";
import { Article } from "@/app/types"; // Import the Article type

interface ArticleModalProps {
  article: Article; // Use the Article type directly
  onClose: () => void;
  theme: "modern" | "newspaper";
}

const shimmer = (w: number, h: number) => `
<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop stop-color="#f6f7f8" offset="0%">
        <animate attributeName="offset" values="-2; 1" dur="2s" repeatCount="indefinite" />
      </stop>
      <stop stop-color="#edeef1" offset="50%">
        <animate attributeName="offset" values="-1; 2" dur="2s" repeatCount="indefinite" />
      </stop>
      <stop stop-color="#f6f7f8" offset="100%">
        <animate attributeName="offset" values="0; 3" dur="2s" repeatCount="indefinite" />
      </stop>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)" />
</svg>
`;

const toBase64 = (str: string) =>
  typeof window === "undefined" ? Buffer.from(str).toString("base64") : window.btoa(str);

const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose, theme }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fullContent, setFullContent] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showDescription, setShowDescription] = useState(true);

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

  useEffect(() => {
    if (fullContent) {
      const descriptionFirstSentence = getFirstSentence(article.description);
      const contentFirstSentence = getFirstSentence(fullContent);
      setShowDescription(descriptionFirstSentence !== contentFirstSentence);
    }
  }, [fullContent, article.description]);

  const fetchFullArticle = async () => {
    setIsLoading(true);
    try {
      // First, try the original method
      const response = await fetch(`/api/fetchFullArticle?url=${encodeURIComponent(article.link)}`);
      if (response.ok) {
        const data = await response.json();
        setFullContent(data.content);
      } else {
        // If the original method fails, try bypassing the paywall
        console.log("Original method failed, attempting to bypass paywall...");
        const bypassedContent = await bypassPaywall(article.link);

        if (bypassedContent) {
          setFullContent(bypassedContent);
        } else {
          throw new Error("Failed to fetch full article");
        }
      }
    } catch (error) {
      console.error("Error fetching full article:", error);
      // Show an error message to the user
      setFullContent("Failed to load the full article. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const getFirstSentence = (text: string | null): string => {
    if (!text) return "";
    const match = text.match(/^.*?[.!?](?:\s|$)/);
    return match ? match[0].trim() : text;
  };

  const sanitizeAndFormatContent = (content: string | null, isFirstParagraph: boolean) => {
    if (!content) return ""; // Handle null content

    const sanitizedContent = DOMPurify.sanitize(content, {
      ADD_TAGS: ["iframe"],
      ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling", "href", "target"],
    });

    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedContent, "text/html");

    // // if doc contains images, list them
    // if (doc.querySelectorAll("img").length > 0) {
    //   console.log("Images found in the article:");
    //   doc.querySelectorAll("img").forEach((img, index) => {
    //     console.log(`Image ${index + 1}: ${img.src}`);
    //   });
    // }

    // list heirarchy of elements
    // console.log(doc.body.innerHTML);

    // Add classes to paragraphs for better spacing and animation
    doc.querySelectorAll("p").forEach((p, index) => {
      p.classList.add("mb-4", "animate-fade-in");
      p.style.animationDelay = `${index * 0.1}s`;
    });

    // Apply large first letter styling to the first paragraph
    const firstParagraph = doc.querySelector("p");
    if (theme === "newspaper" && firstParagraph && isFirstParagraph) {
      firstParagraph.classList.add(
        "first-letter:float-left",
        "first-letter:text-5xl",
        "first-letter:pr-2",
        "first-letter:font-serif"
      );
    }

    // Add classes to headings for proper styling and animation
    doc.querySelectorAll("h1, h2, h3, h4, h5, h6").forEach((heading, index) => {
      heading.classList.add("font-bold", "mt-8", "mb-4", "animate-fade-in");
      (heading as HTMLElement).style.animationDelay = `${index * 0.1}s`;

      // Make headings more prominent
      if (heading.tagName === "H1") {
        heading.classList.add("text-3xl", "md:text-4xl");
      } else if (heading.tagName === "H2") {
        heading.classList.add("text-2xl", "md:text-3xl");
      } else if (heading.tagName === "H3") {
        heading.classList.add("text-xl", "md:text-2xl");
      } else {
        heading.classList.add("text-lg", "md:text-xl");
      }
    });

    // Style blockquotes
    doc.querySelectorAll("blockquote").forEach((quote) => {
      quote.classList.add(
        "border-l-4",
        "pl-4",
        "italic",
        "my-4",
        theme === "newspaper" ? "border-gray-800" : "border-blue-500",
        theme === "newspaper" ? "text-gray-800" : "text-gray-600",
        "dark:text-gray-400"
      );
    });

    // Style links
    doc.querySelectorAll("a").forEach((link) => {
      link.classList.add("text-blue-600", "hover:text-blue-800", "transition-colors");
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
    });

    // Style images
    doc.querySelectorAll("img").forEach((img) => {
      img.classList.add("rounded-lg", "shadow-md", "my-4");
    });

    // Style lists
    doc.querySelectorAll("ul, ol").forEach((list) => {
      list.classList.add("my-4", "ml-6");
    });
    doc.querySelectorAll("li").forEach((item) => {
      item.classList.add("mb-2");
    });

    // Style tables
    doc.querySelectorAll("table").forEach((table) => {
      table.classList.add("w-full", "border-collapse", "my-4");
    });
    doc.querySelectorAll("th, td").forEach((cell) => {
      cell.classList.add("border", "border-gray-300", "dark:border-gray-700", "p-2");
    });

    // Style iframes (e.g., for embedded videos)
    doc.querySelectorAll("iframe").forEach((iframe) => {
      iframe.classList.add("w-full", "aspect-video", "my-4");
    });

    return doc.body.innerHTML;
  };

  const themeClasses =
    theme === "newspaper"
      ? "font-serif text-gray-900 dark:text-gray-100"
      : "font-sans text-gray-800 dark:text-gray-200";

  const contentClasses = `prose prose-lg max-w-none dark:prose-invert mb-8 prose-img:rounded-lg prose-img:shadow-md ${
    theme === "newspaper"
      ? "prose-h1:font-serif prose-h2:font-serif prose-h3:font-serif prose-p:text-justify prose-p:hyphens-auto"
      : "prose-h1:font-sans prose-h2:font-sans prose-h3:font-sans"
  }`;

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  };

  const contentVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.7, // Increased from 0.5 to 0.7
        ease: "easeInOut", // Added easing function for smoother animation
      },
    },
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <motion.div
        ref={modalRef}
        className={`rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative shadow-2xl bg-white dark:bg-gray-800 ${themeClasses}`}
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <button
          onClick={onClose}
          className="md:hidden absolute top-4 right-4 p-2 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 dark:bg-gray-800 dark:bg-opacity-70 dark:hover:bg-opacity-100 z-10"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-4">
            <div className="flex-1 pr-4">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className={`text-3xl sm:text-4xl font-bold leading-tight tracking-tight mb-6 ${
                  theme === "newspaper" ? "font-serif" : "font-sans"
                }`}
              >
                {article.title}
              </motion.h2>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                {article.author && (
                  <span className="mr-4 flex items-center">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {article.author}
                  </span>
                )}
                <span className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  {formatDate(article.pubDate)}
                </span>
              </div>
            </div>
            {article.imageUrl && (
              <div className="w-full md:w-1/3 mb-4 md:mb-0">
                <div className="relative aspect-w-16 aspect-h-9">
                  {!imageLoaded && (
                    <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                  )}
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    layout="fill"
                    objectFit="cover"
                    className={`rounded-lg shadow-md ${
                      imageLoaded ? "opacity-100" : "opacity-0"
                    } transition-opacity duration-300`}
                    placeholder="blur"
                    blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(1200, 675))}`}
                    onLoadingComplete={() => setImageLoaded(true)}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="border-b border-gray-200 dark:border-gray-700 mb-4"></div>

          <AnimatePresence mode="wait">
            {!fullContent ? (
              <motion.div key="description" initial="hidden" animate="visible" exit="hidden" variants={contentVariants}>
                <div
                  className={contentClasses}
                  dangerouslySetInnerHTML={{ __html: sanitizeAndFormatContent(article.description, true) }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="full-content"
                initial="hidden"
                animate="visible"
                exit="hidden"
                variants={contentVariants}
              >
                {showDescription && article.description && (
                  <>
                    <div
                      className={contentClasses}
                      dangerouslySetInnerHTML={{ __html: sanitizeAndFormatContent(article.description, true) }}
                    />
                    <hr className="my-8 border-t border-gray-300 dark:border-gray-700" />
                  </>
                )}
                <div
                  className={contentClasses}
                  dangerouslySetInnerHTML={{ __html: sanitizeAndFormatContent(fullContent, !showDescription) }}
                />
                <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 italic">
                  This article was originally published by {article.author || "the author"} on{" "}
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {new URL(article.link).hostname}
                  </a>
                  .
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex justify-between items-center">
            {!fullContent ? (
              <button
                onClick={fetchFullArticle}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Fetching...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <svg
                      className="mr-2 w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Load Full Article
                  </span>
                )}
              </button>
            ) : (
              <div className="text-sm text-gray-500 dark:text-gray-400">Full article loaded</div>
            )}
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800 transition-colors"
            >
              Read on website
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ArticleModal;
