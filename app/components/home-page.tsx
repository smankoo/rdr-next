"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
import { Sidebar } from "@/app/components/Sidebar";
import { Header } from "@/app/components/Header";
import { ArticleList } from "@/app/components/ArticleList";
import { Feed, Article } from "@/app/types";

export function HomePage() {
  const [activeFilter, setActiveFilter] = React.useState("All Feeds");
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [selectedFeedId, setSelectedFeedId] = useState<string | null>(null);
  const [newFeedUrl, setNewFeedUrl] = useState("");
  const [newFeedName, setNewFeedName] = useState("");
  const [isAddFeedOpen, setIsAddFeedOpen] = useState(false);

  useEffect(() => {
    fetchFeeds();
  }, []);

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

  const addFeed = async () => {
    try {
      const response = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newFeedUrl, name: newFeedName }),
      });
      if (!response.ok) throw new Error("Failed to add feed");
      const newFeed = await response.json();
      setFeeds((prevFeeds) => [...prevFeeds, newFeed]);
      setNewFeedUrl("");
      setNewFeedName("");
      setIsAddFeedOpen(false);
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
      setFeeds((prevFeeds) => prevFeeds.filter((feed) => feed.id !== feedId));
    } catch (error) {
      console.error("Error deleting feed:", error);
    }
  };

  const displayedArticles = selectedFeedId
    ? feeds.find((feed) => feed.id === selectedFeedId)?.articles || []
    : feeds.flatMap((feed) => feed.articles);

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
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
      />
      <main className="flex-1 flex flex-col overflow-hidden border-l border-gray-200">
        <Header />
        <div className="flex space-x-2 p-4 border-b">
          {["All Feeds", "Unread", "Starred"].map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => {
                setActiveFilter(filter);
                setSelectedFeedId(null);
              }}
            >
              {filter}
            </Button>
          ))}
        </div>
        <ArticleList articles={displayedArticles} />
      </main>
    </div>
  );
}
