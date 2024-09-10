export interface Feed {
  id: string;
  name: string;
  url: string;
  articles: Article[];
}

export interface Article {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  link: string;
  pubDate: Date;
  author?: string | null;
  categories?: string[] | null;
  imageUrl?: string | null;
  feedId: string;
  createdAt: Date;
  updatedAt: Date;
  isRead: boolean;
}
