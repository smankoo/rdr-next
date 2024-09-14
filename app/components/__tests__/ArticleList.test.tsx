import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ArticleList from "../ArticleList";
import { Article } from "@/app/types";

describe("ArticleList", () => {
  const mockArticles: Article[] = [
    {
      id: "1",
      title: "Article 1",
      link: "https://example.com/1",
      description: "Description 1",
      pubDate: new Date(),
      isRead: false,
      feedId: "feed1",
    },
    {
      id: "2",
      title: "Article 2",
      link: "https://example.com/2",
      description: "Description 2",
      pubDate: new Date(),
      isRead: true,
      feedId: "feed2",
    },
  ];

  const mockProps = {
    articles: mockArticles,
    isLoading: false,
    feeds: [],
    markArticleAsRead: jest.fn(),
    fetchAllArticles: jest.fn(),
    displayMode: "list" as const,
    setDisplayMode: jest.fn(),
    theme: "modern" as const, // Add this line
  };

  it("renders a list of articles", () => {
    render(<ArticleList {...mockProps} />);
    expect(screen.getByText("Article 1")).toBeInTheDocument();
    expect(screen.getByText("Article 2")).toBeInTheDocument();
  });

  it("renders the correct number of articles", () => {
    render(<ArticleList {...mockProps} />);
    const articleItems = screen.getAllByRole("article");
    expect(articleItems).toHaveLength(2);
  });
});
