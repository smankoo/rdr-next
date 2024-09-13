import { NextResponse } from "next/server";
import axios from "axios";
import { JSDOM } from "jsdom";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    const headers = {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.82 Safari/537.36",
      Referer: "https://www.google.com/",
      DNT: "1",
    };

    const response = await axios.get(url, { headers });

    if (response.status === 200) {
      const articleContent = extractArticleContent(response.data);
      return NextResponse.json({ content: articleContent });
    } else {
      return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in bypassPaywall API:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

function extractArticleContent(html: string): string {
  // Parse the HTML using jsdom
  const dom = new JSDOM(html);
  const doc = dom.window.document;

  // Try to find the article content using various methods
  let content = "";

  // Method 1: Look for <article> tag
  const articleElement = doc.querySelector("article");
  if (articleElement) {
    content = articleElement.innerHTML;
  }

  // Method 2: Look for a div with many paragraph children
  if (!content) {
    const divs = doc.querySelectorAll("div");
    let maxParagraphs = 0;
    let bestDiv: HTMLElement | undefined;

    divs.forEach((div) => {
      const paragraphs = div.querySelectorAll("p");
      if (paragraphs.length > maxParagraphs) {
        maxParagraphs = paragraphs.length;
        bestDiv = div as HTMLElement;
      }
    });

    if (bestDiv) {
      content = bestDiv.innerHTML;
    }
  }

  // Method 3: Look for common article class names
  if (!content) {
    const commonClasses = [
      "article-body",
      "post-content",
      "entry-content",
      "story-body",
      "main-content",
      "article-content",
      "content-body",
    ];
    for (const className of commonClasses) {
      const element = doc.querySelector(`.${className}`);
      if (element) {
        content = element.innerHTML;
        break;
      }
    }
  }

  // Method 4: Look for common article ID names
  if (!content) {
    const commonIds = ["article-content", "main-content", "post-content", "story-content"];
    for (const id of commonIds) {
      const element = doc.getElementById(id);
      if (element) {
        content = element.innerHTML;
        break;
      }
    }
  }

  // Method 5: Look for the largest content block
  if (!content) {
    const allElements = doc.body.getElementsByTagName("*");
    let maxLength = 0;
    let largestElement: HTMLElement | null = null;

    for (let i = 0; i < allElements.length; i++) {
      const element = allElements[i] as HTMLElement;
      if (element.textContent && element.textContent.length > maxLength) {
        maxLength = element.textContent.length;
        largestElement = element;
      }
    }

    if (largestElement) {
      content = largestElement.innerHTML;
    }
  }

  // Method 6: If all else fails, just get the body content
  if (!content) {
    content = doc.body.innerHTML;
  }

  // Clean up the content (remove scripts, styles, comments, etc.)
  content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  content = content.replace(/<!--[\s\S]*?-->/g, "");
  content = content.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "");

  // Remove empty paragraphs and divs
  content = content.replace(/<p>\s*<\/p>/gi, "");
  content = content.replace(/<div>\s*<\/div>/gi, "");

  return content;
}
