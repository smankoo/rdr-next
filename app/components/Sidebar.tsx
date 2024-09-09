import React from "react";
import { Plus, ChevronRight } from "lucide-react";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Button } from "@/app/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/app/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Feed } from "@/app/types";
import { useResizable } from "@/app/hooks/useResizable";
import { useState } from "react";

interface SidebarProps {
  feeds: Feed[];
  selectedFeedId: string | null;
  setSelectedFeedId: (id: string) => void;
  deleteFeed: (id: string) => void;
  addFeed: () => void;
  newFeedUrl: string;
  setNewFeedUrl: (url: string) => void;
  newFeedName: string;
  setNewFeedName: (name: string) => void;
  isAddFeedOpen: boolean;
  setIsAddFeedOpen: (isOpen: boolean) => void;
  setFeeds: React.Dispatch<React.SetStateAction<Feed[]>>; // Add this line
}

export function Sidebar({
  feeds,
  selectedFeedId,
  setSelectedFeedId,
  deleteFeed,
  addFeed,
  newFeedUrl,
  setNewFeedUrl,
  newFeedName,
  setNewFeedName,
  isAddFeedOpen,
  setIsAddFeedOpen,
  setFeeds, // Add this line
}: SidebarProps) {
  const { width, startResizing } = useResizable(256, 200, 400);

  const handleAddFeed = async (url: string) => {
    try {
      const response = await fetch("/api/feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!response.ok) throw new Error("Failed to add feed");
      const newFeed = await response.json();
      setFeeds((prevFeeds) => [...prevFeeds, newFeed]);
      setSelectedFeedId(newFeed.id);
    } catch (error) {
      console.error("Error adding feed:", error);
    }
  };

  return (
    <aside className="p-4 hidden md:block relative" style={{ width: `${width}px` }}>
      <div
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-gray-300"
        onMouseDown={startResizing}
      />
      <h2 className="text-lg font-semibold mb-4">Feeds</h2>
      <ScrollArea className="h-[calc(100vh-8rem)]">
        {feeds.map((feed) => (
          <Collapsible key={feed.id}>
            <div
              className={`flex items-center justify-between w-full p-2 hover:bg-accent rounded-md cursor-pointer ${
                selectedFeedId === feed.id ? "bg-accent" : ""
              }`}
              onClick={() => setSelectedFeedId(feed.id)}
            >
              <CollapsibleTrigger asChild>
                <span className="flex-grow">{feed.name}</span>
              </CollapsibleTrigger>
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFeed(feed.id);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M3 6h18" />
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                  </svg>
                </Button>
                <ChevronRight className="h-4 w-4" />
              </div>
            </div>
          </Collapsible>
        ))}
      </ScrollArea>
      <Dialog open={isAddFeedOpen} onOpenChange={setIsAddFeedOpen}>
        <DialogTrigger asChild>
          <Button className="w-full mt-4" variant="outline">
            <Plus className="mr-2 h-4 w-4" /> Add Feed
          </Button>
        </DialogTrigger>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Add New Feed</DialogTitle>
          </DialogHeader>
          <Input
            value={newFeedUrl}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFeedUrl(e.target.value)}
            placeholder="Feed URL"
            className="mb-2"
          />
          <Input
            value={newFeedName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFeedName(e.target.value)}
            placeholder="Feed Name (optional)"
            className="mb-2"
          />
          <Button onClick={addFeed}>Add Feed</Button>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
