"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Sidebar } from "@/app/components/Sidebar";
import { Header } from "@/app/components/Header";
import ArticleList from "@/app/components/ArticleList";
import { Feed, Article } from "@/app/types";
import { fetchArticles, fetchFeeds, addFeed, deleteFeed, updateFeed } from "@/app/lib/feedUtils";
import { useUserPreferences } from "../hooks/useUserPreferences";
import dynamic from "next/dynamic";
import SettingsModal from "@/app/components/SettingsModal";
import { UserPreferences } from "@/app/types";

const FilterButtons = dynamic(() => import("@/app/components/FilterButtons").then((mod) => mod.FilterButtons), {
  ssr: false,
});

export function HomePage() {
  const [preferences, updatePreference] = useUserPreferences();
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [newFeedName, setNewFeedName] = useState("");
  const [isAddFeedOpen, setIsAddFeedOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const loadArticles = useCallback(async () => {
    setIsLoading(true);
    try {
      const fetchedArticles = await fetchArticles(preferences.selectedFeedId || undefined);
      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setIsLoading(false);
    }
  }, [preferences.selectedFeedId]);

  useEffect(() => {
    const initializePage = async () => {
      await loadFeeds();
      await loadArticles();
    };
    initializePage();
  }, [loadArticles]);

  const loadFeeds = async () => {
    try {
      const fetchedFeeds = await fetchFeeds();
      setFeeds(fetchedFeeds);
    } catch (error) {
      console.error("Error fetching feeds:", error);
    }
  };

  const handleAddFeed = useCallback(
    async (url: string, name: string) => {
      try {
        const newFeed = await addFeed(url, name);
        setFeeds((prevFeeds) => [...prevFeeds, newFeed]);
        updatePreference("selectedFeedId", newFeed.id);
        setNewFeedUrl("");
        setNewFeedName("");
        setIsAddFeedOpen(false);
        await loadArticles();
      } catch (error) {
        console.error("Error adding feed:", error);
      }
    },
    [updatePreference, loadArticles]
  );

  const handleDeleteFeed = useCallback(
    async (feedId: string) => {
      try {
        await deleteFeed(feedId);
        setFeeds((prevFeeds) => prevFeeds.filter((feed) => feed.id !== feedId));
        if (feeds.length === 1) {
          setArticles([]);
          updatePreference("selectedFeedId", null);
        }
      } catch (error) {
        console.error("Error deleting feed:", error);
      }
    },
    [feeds.length, updatePreference]
  );

  const handleUpdateFeed = useCallback(async (id: string, url: string, name: string) => {
    try {
      await updateFeed(id, url, name);
      setFeeds((prevFeeds) => prevFeeds.map((feed) => (feed.id === id ? { ...feed, url, name } : feed)));
    } catch (error) {
      console.error("Error updating feed:", error);
    }
  }, []);

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
    updatePreference("displayMode", preferences.displayMode === "list" ? "grid" : "list");
  }, [preferences.displayMode, updatePreference]);

  const handleSetActiveFilter = useCallback(
    (filter: "All Articles" | "Unread") => {
      updatePreference("activeFilter", filter);
    },
    [updatePreference]
  );

  const filteredArticles = useMemo(() => {
    let filtered = articles;
    if (preferences.selectedFeedId) {
      filtered = filtered.filter((article) => article.feedId === preferences.selectedFeedId);
    }
    if (preferences.activeFilter === "Unread") {
      filtered = filtered.filter((article) => !article.isRead);
    }
    return filtered;
  }, [articles, preferences.selectedFeedId, preferences.activeFilter]);

  const currentFeed = preferences.selectedFeedId ? feeds.find((feed) => feed.id === preferences.selectedFeedId) : null;
  const currentFeedName = currentFeed?.name || "All Feeds";
  const lastRefreshed = currentFeed?.lastRefreshed ? new Date(currentFeed.lastRefreshed) : null;

  const sidebarProps = useMemo(
    () => ({
      feeds,
      selectedFeedId: preferences.selectedFeedId,
      setSelectedFeedId: (id: string | null) => updatePreference("selectedFeedId", id),
      deleteFeed: handleDeleteFeed,
      addFeed: handleAddFeed,
      updateFeed: handleUpdateFeed,
      newFeedUrl,
      setNewFeedUrl,
      newFeedName,
      setNewFeedName,
      isAddFeedOpen,
      setIsAddFeedOpen,
      theme: preferences.theme,
      setTheme: (theme: "modern" | "newspaper") => updatePreference("theme", theme),
    }),
    [
      feeds,
      preferences.selectedFeedId,
      newFeedUrl,
      newFeedName,
      isAddFeedOpen,
      preferences.theme,
      updatePreference,
      handleDeleteFeed,
      handleAddFeed,
      handleUpdateFeed,
    ]
  );

  const handleOpenSettings = () => {
    setIsSettingsOpen(true);
  };

  const handleCloseSettings = () => {
    setIsSettingsOpen(false);
  };

  const handleUpdatePreference = useCallback(
    (key: keyof UserPreferences, value: any) => {
      updatePreference(key, value);
    },
    [updatePreference]
  );

  return (
    <div className={`flex h-screen ${preferences.theme === "newspaper" ? "font-serif" : "font-sans"}`}>
      <Sidebar {...sidebarProps} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          feedName={currentFeedName}
          lastRefreshed={lastRefreshed}
          handleRefreshFeeds={handleRefreshFeeds}
          displayMode={preferences.displayMode}
          toggleDisplayMode={toggleDisplayMode}
          filterButtons={
            <FilterButtons activeFilter={preferences.activeFilter} handleSetActiveFilter={handleSetActiveFilter} />
          }
          onOpenSettings={handleOpenSettings}
        />
        <ArticleList
          articles={filteredArticles}
          isLoading={isLoading}
          feeds={feeds}
          markArticleAsRead={handleMarkArticleAsRead}
          displayMode={preferences.displayMode}
          theme={preferences.theme} // Add this line
        />
      </main>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={handleCloseSettings}
        theme={preferences.theme}
        setTheme={(theme) => handleUpdatePreference("theme", theme)}
        displayMode={preferences.displayMode}
        setDisplayMode={(mode) => handleUpdatePreference("displayMode", mode)}
      />
    </div>
  );
}

export default HomePage;
