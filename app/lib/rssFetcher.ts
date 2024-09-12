export interface FeedItem {
  title: string;
  description?: string; // Add this line
  link: string;
  pubDate: string;
  author?: string;
  categories?: string[];
  imageUrl?: string;
}

interface FeedResult {
  title: string;
  items: FeedItem[];
}

export async function fetchFeed(url: string): Promise<FeedResult> {
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
          let feedItems: FeedItem[];
          let feedTitle: string;

          if (result.rss) {
            // RSS feed
            feedItems = parseRSS(result.rss);
            feedTitle = result.rss.channel[0].title[0];
            console.log("Feed type: RSS");
          } else if (result.feed) {
            // Atom feed
            feedItems = parseAtom(result.feed);
            feedTitle = result.feed.title[0];
            console.log("Feed type: Atom");
          } else {
            reject(new Error("Unknown feed format"));
            return;
          }

          // Sort feedItems by pubDate in descending order
          feedItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

          resolve({ title: feedTitle, items: feedItems });
        }
      });
    });
  } catch (error) {
    console.error("Error fetching feed:", error);
    throw error;
  }
}

function parseRSS(rss: any): FeedItem[] {
  const items = rss.channel[0].item;
  return items.map((item: any) => {
    let imageUrl: string | undefined;

    // Check for enclosure
    if (item.enclosure && item.enclosure[0].$.type.startsWith("image")) {
      imageUrl = item.enclosure[0].$.url;
    }

    // Check for media:thumbnail or media:content
    if (!imageUrl && item["media:thumbnail"]?.[0]?.$ && item["media:thumbnail"][0].$.url) {
      imageUrl = item["media:thumbnail"][0].$.url;
    } else if (
      !imageUrl &&
      item["media:content"]?.[0]?.$ &&
      item["media:content"][0].$.medium === "image" &&
      item["media:content"][0].$.url
    ) {
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
      description: item.description[0],
      link: item.link[0],
      pubDate: item.pubDate[0],
      // author: item.author ? item.author[0] : undefined,
      categories: item.category,
      imageUrl,
      author: item["dc:creator"] ? item["dc:creator"][0] : undefined,
    };
  });
}

function parseAtom(feed: any): FeedItem[] {
  const entries = feed.entry;
  return entries.map((entry: any) => {
    let imageUrl: string | undefined;
    let description: string = "";

    // Extract image URL and description from content
    if (entry.content && entry.content[0]._) {
      const content = entry.content[0]._;

      // Extract image URL
      const imageMatch = content.match(/<img.*?src="(.*?)"/);
      if (imageMatch) {
        imageUrl = imageMatch[1];
      }

      // Extract description
      const descriptionMatch = content.match(/<\/figure>([\s\S]*)/);
      if (descriptionMatch) {
        // Remove HTML tags and trim
        description = descriptionMatch[1].replace(/<[^>]*>/g, "").trim();
      }
    }

    // Fallback to media:thumbnail or media:content if no image found in content
    if (!imageUrl && entry["media:thumbnail"]) {
      imageUrl = entry["media:thumbnail"][0].$.url;
    } else if (!imageUrl && entry["media:content"] && entry["media:content"][0].$.medium === "image") {
      imageUrl = entry["media:content"][0].$.url;
    }

    return {
      title: entry.title[0],
      description: description, // Use the extracted description instead of full content
      link: entry.link[0].$.href,
      pubDate: entry.published[0] || entry.updated[0],
      author: entry.author ? entry.author[0].name[0] : undefined,
      categories: entry.category ? entry.category.map((cat: any) => cat.$.term) : undefined,
      imageUrl,
    };
  });
}
