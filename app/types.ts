export interface Feed {
  id: string;
  name: string;
  url: string;
  lastRefreshed?: string; // Add this line
  articles: Article[];
}

export interface Article {
  id: string;
  title: string;
  description: string | null; // Allow null
  pubDate: Date;
  author?: string;
  imageUrl?: string;
  link: string;
  isRead: boolean;
  feedId: string;
}
