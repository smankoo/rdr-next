"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Sidebar } from "@/app/components/Sidebar";
import { Header } from "@/app/components/Header";
import ArticleList from "@/app/components/ArticleList";
import { Feed, Article } from "@/app/types";
import { fetchArticles, fetchFeeds, addFeed, deleteFeed, updateFeed } from "@/app/lib/feedUtils";
import { useTheme } from "../contexts/ThemeContext";
import useLocalStorage from "@/app/hooks/useLocalStorage";
import dynamic from "next/dynamic";

const FilterButtons = dynamic(() => import("@/app/components/FilterButtons").then((mod) => mod.FilterButtons), {
  ssr: false,
});

export function HomePage() {
  const { theme } = useTheme();
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayMode, setDisplayMode] = useLocalStorage<"list" | "grid">("displayMode", "list");
  const [activeFilter, setActiveFilter] = useLocalStorage<"All Articles" | "Unread">("activeFilter", "All Articles");
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [newFeedName, setNewFeedName] = useState("");
  const [isAddFeedOpen, setIsAddFeedOpen] = useState(false);

  useEffect(() => {
    initializePage();
  }, []);

  useEffect(() => {
    loadArticles();
  }, [selectedFeedId]);

  const initializePage = async () => {
    await loadFeeds();
    await loadArticles();
  };

  const loadFeeds = async () => {
    try {
      const fetchedFeeds = await fetchFeeds();
      setFeeds(fetchedFeeds);
    } catch (error) {
      console.error("Error fetching feeds:", error);
    }
  };

  const loadArticles = async () => {
    setIsLoading(true);
    try {
      const fetchedArticles = await fetchArticles(selectedFeedId || undefined);
      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddFeed = async (url: string, name: string) => {
    try {
      const newFeed = await addFeed(url, name);
      setFeeds((prevFeeds) => [...prevFeeds, newFeed]);
      setSelectedFeedId(newFeed.id);
      setNewFeedUrl("");
      setNewFeedName("");
      setIsAddFeedOpen(false);
      await loadArticles();
    } catch (error) {
      console.error("Error adding feed:", error);
    }
  };

  const handleDeleteFeed = async (feedId: string) => {
    try {
      await deleteFeed(feedId);
      setFeeds((prevFeeds) => prevFeeds.filter((feed) => feed.id !== feedId));
      if (feeds.length === 1) {
        setArticles([]);
        setSelectedFeedId(null);
      }
    } catch (error) {
      console.error("Error deleting feed:", error);
    }
  };

  const handleUpdateFeed = async (id: string, url: string, name: string) => {
    try {
      await updateFeed(id, url, name);
      setFeeds((prevFeeds) => prevFeeds.map((feed) => (feed.id === id ? { ...feed, url, name } : feed)));
    } catch (error) {
      console.error("Error updating feed:", error);
    }
  };

  const handleMarkArticleAsRead = async (articleId: string, isRead: boolean = true) => {
    try {
      const response = await fetch(`/api/articles/${articleId}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead }),
      });

      if (response.ok) {
        setArticles((prevArticles) =>
          prevArticles.map((article) => (article.id === articleId ? { ...article, isRead } : article))
        );
      } else {
        throw new Error("Failed to mark article as read");
      }
    } catch (error) {
      console.error("Error marking article as read:", error);
    }
  };

  const handleRefreshFeeds = async () => {
    try {
      await fetch("/api/feeds/refresh");
      await loadFeeds();
      await loadArticles();
    } catch (error) {
      console.error("Error refreshing feeds:", error);
    }
  };

  const toggleDisplayMode = useCallback(() => {
    setDisplayMode((prevMode) => (prevMode === "list" ? "grid" : "list"));
  }, [setDisplayMode]);

  const handleSetActiveFilter = (filter: "All Articles" | "Unread") => setActiveFilter(filter);

  const filteredArticles = useCallback(() => {
    return activeFilter === "Unread" ? articles.filter((article) => !article.isRead) : articles;
  }, [articles, activeFilter]);

  const currentFeed = selectedFeedId ? feeds.find((feed) => feed.id === selectedFeedId) : null;
  const currentFeedName = currentFeed?.name || "All Feeds";
  const lastRefreshed = currentFeed?.lastRefreshed ? new Date(currentFeed.lastRefreshed) : null;

  const sidebarProps = useMemo(
    () => ({
      feeds,
      selectedFeedId,
      setSelectedFeedId,
      deleteFeed: handleDeleteFeed,
      addFeed: handleAddFeed,
      updateFeed: handleUpdateFeed,
      newFeedUrl,
      setNewFeedUrl,
      newFeedName,
      setNewFeedName,
      isAddFeedOpen,
      setIsAddFeedOpen,
    }),
    [feeds, selectedFeedId, newFeedUrl, newFeedName, isAddFeedOpen]
  );

  return (
    <div className={`flex h-screen ${theme === "newspaper" ? "font-serif" : "font-sans"}`}>
      <Sidebar {...sidebarProps} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          feedName={currentFeedName}
          lastRefreshed={lastRefreshed}
          handleRefreshFeeds={handleRefreshFeeds}
          displayMode={displayMode}
          toggleDisplayMode={toggleDisplayMode}
          handleSetActiveFilter={handleSetActiveFilter}
          activeFilter={activeFilter}
          setDisplayMode={setDisplayMode}
          filterButtons={<FilterButtons activeFilter={activeFilter} handleSetActiveFilter={handleSetActiveFilter} />}
        />
        <ArticleList
          articles={filteredArticles()}
          isLoading={isLoading}
          feeds={feeds}
          markArticleAsRead={handleMarkArticleAsRead}
          fetchAllArticles={loadArticles}
          displayMode={displayMode}
        />
      </main>
    </div>
  );
}

export default HomePage;
