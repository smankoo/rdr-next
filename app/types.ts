export interface Feed {
  id: string;
  name: string;
  articles: Article[];
}

export interface Article {
  id: string;
  title: string;
  link: string;
  description: string;
  pubDate: string;
  imageUrl?: string;
}
