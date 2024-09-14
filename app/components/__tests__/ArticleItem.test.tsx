import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ArticleItem } from "../ArticleItem";
import { Article } from "@/app/types";

describe("ArticleItem", () => {
  const mockArticle: Article = {
    id: "1",
    title: "Test Article",
    link: "https://example.com",
    description: "This is a test article",
    pubDate: new Date(),
    isRead: false,
    feedId: "feed1",
  };

  const mockProps = {
    article: mockArticle,
    feedName: "Test Feed",
    onTitleClick: jest.fn(),
    displayMode: "list" as const,
    markArticleAsRead: jest.fn(),
  };

  it("renders article title", () => {
    render(<ArticleItem {...mockProps} />);
    expect(screen.getByText("Test Article")).toBeInTheDocument();
  });

  it("renders article description", () => {
    render(<ArticleItem {...mockProps} />);
    expect(screen.getByText("This is a test article")).toBeInTheDocument();
  });

  it("renders article link", () => {
    render(<ArticleItem {...mockProps} />);
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "https://example.com");
  });
});
