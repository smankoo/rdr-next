"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/app/components/ui/button";
import { Sidebar } from "@/app/components/Sidebar";
import { Header } from "@/app/components/Header";
import ArticleList from "@/app/components/ArticleList";
import { Feed, Article } from "@/app/types";
import { fetchArticles } from "@/app/lib/feedUtils";
import { useTheme } from "../contexts/ThemeContext";

export function HomePage() {
  const { theme } = useTheme();

  const [activeFilter, setActiveFilter] = useState<"All Articles" | "Unread">("All Articles");
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [newFeedName, setNewFeedName] = useState("");
  const [isAddFeedOpen, setIsAddFeedOpen] = useState(false);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(0);

  useEffect(() => {
    fetchFeeds();
    fetchAllArticles();
  }, []);

  useEffect(() => {
    if (selectedFeedId) {
      fetchArticlesForFeed(selectedFeedId);
    } else {
      fetchAllArticles();
    }
  }, [selectedFeedId]);

  const fetchFeeds = async () => {
    try {
      const response = await fetch("/api/feeds");
      if (!response.ok) throw new Error("Failed to fetch feeds");
      const data = await response.json();
      setFeeds(data);
    } catch (error) {
      console.error("Error fetching feeds:", error);
    }
  };

  const addFeed = async (url: string, name: string) => {
    try {
      const response = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, name }),
      });
      if (!response.ok) throw new Error("Failed to add feed");
      const newFeed = await response.json();
      setFeeds((prevFeeds) => [...prevFeeds, newFeed]);
      setIsAddFeedOpen(false);
      setSelectedFeedId(newFeed.id);
      fetchArticlesForFeed(newFeed.id);
    } catch (error) {
      console.error("Error adding feed:", error);
    }
  };

  const deleteFeed = async (feedId: string) => {
    try {
      const response = await fetch(`/api/feeds/${feedId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete feed");
      setFeeds((prevFeeds) => {
        const updatedFeeds = prevFeeds.filter((feed) => feed.id !== feedId);
        if (updatedFeeds.length === 0) {
          setArticles([]);
          setSelectedFeedId(null);
        }
        return updatedFeeds;
      });
    } catch (error) {
      console.error("Error deleting feed:", error);
    }
  };

  const fetchAllArticles = async () => {
    setIsLoading(true);
    try {
      const fetchedArticles = await fetchArticles(selectedFeedId || undefined);
      console.log("Fetched articles in home-page:", fetchedArticles);
      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchArticlesForFeed = async (feedId: string) => {
    setIsLoading(true);
    try {
      const fetchedArticles = await fetchArticles(feedId);
      console.log(`Fetched articles for feed ${feedId}:`, fetchedArticles);
      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Error fetching articles for feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentFeed = selectedFeedId ? feeds.find((feed) => feed.id === selectedFeedId) : null;

  const currentFeedName = selectedFeedId
    ? feeds.find((feed) => feed.id === selectedFeedId)?.name || "Unknown Feed"
    : "All Feeds";

  const lastRefreshed = selectedFeedId
    ? feeds.find((feed) => feed.id === selectedFeedId)?.lastRefreshed
      ? new Date(feeds.find((feed) => feed.id === selectedFeedId)!.lastRefreshed!)
      : null
    : null;

  const filterButtons = (
    <>
      {["All Articles", "Unread"].map((filter) => (
        <Button
          key={filter}
          variant={activeFilter === filter ? "default" : "outline"}
          onClick={() => setActiveFilter(filter as "All Articles" | "Unread")}
        >
          {filter}
        </Button>
      ))}
    </>
  );

  const filteredArticles = useCallback(() => {
    if (activeFilter === "Unread") {
      return articles.filter((article) => !article.isRead);
    }
    return articles;
  }, [articles, activeFilter]);

  const displayedArticles = selectedFeedId ? articles : articles;

  const updateFeed = async (id: string, url: string, name: string) => {
    try {
      const response = await fetch(`/api/feeds/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, name }),
      });

      if (response.ok) {
        setFeeds((prevFeeds) => prevFeeds.map((feed) => (feed.id === id ? { ...feed, url, name } : feed)));
      } else {
        console.error("Failed to update feed");
      }
    } catch (error) {
      console.error("Error updating feed:", error);
    }
  };

  const markArticleAsRead = async (articleId: string, isRead: boolean = true) => {
    try {
      const response = await fetch(`/api/articles/${articleId}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isRead }),
      });

      if (response.ok) {
        setArticles((prevArticles) =>
          prevArticles.map((article) => (article.id === articleId ? { ...article, isRead } : article))
        );
      } else {
        console.error("Failed to mark article as read");
      }
    } catch (error) {
      console.error("Error marking article as read:", error);
    }
  };

  const handleRefreshFeeds = async () => {
    try {
      const response = await fetch("/api/feeds/refresh");
      if (response.ok) {
        console.log("Feeds refreshed successfully");
      } else {
        console.error("Failed to refresh feeds");
      }
    } catch (error) {
      console.error("Error refreshing feeds:", error);
    }
  };

  const themeClasses = theme === "newspaper" ? "font-serif" : "font-sans";

  return (
    <div className={`flex h-screen ${themeClasses}`}>
      <Sidebar
        feeds={feeds}
        selectedFeedId={selectedFeedId}
        setSelectedFeedId={setSelectedFeedId}
        deleteFeed={deleteFeed}
        addFeed={addFeed}
        newFeedUrl={newFeedUrl}
        setNewFeedUrl={setNewFeedUrl}
        newFeedName={newFeedName}
        setNewFeedName={setNewFeedName}
        isAddFeedOpen={isAddFeedOpen}
        setIsAddFeedOpen={setIsAddFeedOpen}
        updateFeed={updateFeed}
      />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          feedName={currentFeedName}
          filterButtons={filterButtons}
          lastRefreshed={lastRefreshed}
          handleRefreshFeeds={handleRefreshFeeds}
        />
        <ArticleList
          articles={filteredArticles()}
          isLoading={isLoading}
          feeds={feeds}
          markArticleAsRead={markArticleAsRead}
          fetchAllArticles={fetchAllArticles}
        />
      </main>
    </div>
  );

  console.log("Displayed articles:", displayedArticles);
}

export default HomePage;
