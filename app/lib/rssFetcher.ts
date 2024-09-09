import type { ParsedUrlQuery } from "querystring";

interface FeedItem {
  title: string;
  content: string;
  link: string;
  pubDate: string;
  author?: string;
  categories?: string[];
  imageUrl?: string;
}

export async function fetchFeed(url: string): Promise<FeedItem[]> {
  if (typeof window !== "undefined") {
    throw new Error("This function can only be called on the server side");
  }

  // Dynamically import xml2js and node-fetch
  const { parseString } = await import("xml2js");
  const fetch = (await import("node-fetch")).default;

  try {
    const response = await fetch(url);
    const text = await response.text();

    return new Promise((resolve, reject) => {
      parseString(text, (err: Error | null, result: any) => {
        if (err) {
          console.error("Error parsing XML:", err);
          reject(err);
        } else {
          const items = result.rss.channel[0].item;
          const feedItems: FeedItem[] = items.map((item: any) => {
            let imageUrl: string | undefined;

            // Check for enclosure
            if (item.enclosure && item.enclosure[0].$.type.startsWith("image")) {
              imageUrl = item.enclosure[0].$.url;
            }

            // Check for media:thumbnail or media:content
            if (!imageUrl && item["media:thumbnail"]) {
              imageUrl = item["media:thumbnail"][0].$.url;
            } else if (!imageUrl && item["media:content"] && item["media:content"][0].$.medium === "image") {
              imageUrl = item["media:content"][0].$.url;
            }

            // Check for image in content
            if (!imageUrl && item.description) {
              const match = item.description[0].match(/<img.*?src="(.*?)"/);
              if (match) {
                imageUrl = match[1];
              }
            }

            return {
              title: item.title[0],
              content: item.description[0],
              link: item.link[0],
              pubDate: item.pubDate[0],
              author: item.author ? item.author[0] : undefined,
              categories: item.category,
              imageUrl,
            };
          });

          // Sort feedItems by pubDate in descending order
          feedItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

          resolve(feedItems);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    throw error;
  }
}
