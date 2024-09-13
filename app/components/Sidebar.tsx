import React, { useState, useEffect } from "react";
import { Plus, Settings, ChevronRight, ChevronDown, Sun, Moon } from "lucide-react";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Button } from "@/app/components/ui/button";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/app/components/ui/collapsible";
import { Dialog, DialogTrigger } from "@/app/components/ui/dialog";
import { Feed } from "@/app/types";
import { useResizable } from "@/app/hooks/useResizable";
import { AddFeedModal } from "./AddFeedModal";
import { FeedSettingsModal } from "./FeedSettingsModal";
import { useTheme } from "../contexts/ThemeContext";

interface SidebarProps {
  feeds: Feed[];
  selectedFeedId: string | null;
  setSelectedFeedId: (id: string | null) => void;
  deleteFeed: (id: string) => void;
  addFeed: (url: string, name: string) => Promise<void>;
  newFeedUrl: string;
  setNewFeedUrl: (url: string) => void;
  newFeedName: string;
  setNewFeedName: (name: string) => void;
  isAddFeedOpen: boolean;
  setIsAddFeedOpen: (isOpen: boolean) => void;
  updateFeed: (id: string, url: string, name: string) => Promise<void>;
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
  updateFeed,
}: SidebarProps) {
  const { width, startResizing } = useResizable(256, 200, 400);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingFeed, setEditingFeed] = useState<Feed | null>(null);
  const [editingFeedUrl, setEditingFeedUrl] = useState("");
  const [editingFeedName, setEditingFeedName] = useState("");
  const [isAllFeedsOpen, setIsAllFeedsOpen] = useState(true);
  const [isResizing, setIsResizing] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleMouseUp = () => {
      setIsResizing(false);
      document.body.classList.remove("resizing");
    };

    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleStartResizing = (e: React.MouseEvent) => {
    setIsResizing(true);
    document.body.classList.add("resizing");
    startResizing(e);
  };

  const handleOpenSettings = (feed: Feed) => {
    setEditingFeed(feed);
    setEditingFeedUrl(feed.url);
    setEditingFeedName(feed.name);
    setIsSettingsOpen(true);
  };

  const handleDeleteFeed = async (feedId: string) => {
    const feedIndex = feeds.findIndex((feed) => feed.id === feedId);

    // Delete the feed
    await deleteFeed(feedId);

    // Update selected feed
    if (selectedFeedId === feedId) {
      if (feedIndex > 0) {
        // Set the feed above the deleted one as selected
        setSelectedFeedId(feeds[feedIndex - 1].id);
      } else if (feeds.length > 1) {
        // If it was the first feed, select the next one
        setSelectedFeedId(feeds[1].id);
      } else {
        // If it was the only feed, clear selection
        setSelectedFeedId(null);
      }
    }

    // No need to manually refresh the feeds list here,
    // as it should be handled by the parent component
  };

  const toggleTheme = () => {
    setTheme(theme === "modern" ? "newspaper" : "modern");
  };

  return (
    <aside className="p-4 hidden md:block relative select-none" style={{ width: `${width}px` }}>
      <div
        className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-gray-300"
        onMouseDown={handleStartResizing}
      />
      <h2 className="text-lg font-semibold mb-4">Feeds</h2>
      <ScrollArea className="h-[calc(100vh-16rem)]">
        {" "}
        {/* Adjusted height to accommodate theme selector */}
        <Collapsible open={isAllFeedsOpen} onOpenChange={setIsAllFeedsOpen} className="space-y-2">
          <div className="flex items-center w-full h-10 rounded-md overflow-hidden">
            <div
              className={`flex-grow h-full flex items-center px-3 cursor-pointer transition-colors ${
                selectedFeedId === null ? "bg-primary text-primary-foreground" : "bg-secondary hover:bg-secondary/80"
              }`}
              onClick={() => setSelectedFeedId(null)}
            >
              <span className={`truncate ${selectedFeedId === null ? "font-semibold" : ""}`}>All Feeds</span>
            </div>
            <CollapsibleTrigger asChild>
              <Button
                variant={isAllFeedsOpen ? "default" : "secondary"}
                size="icon"
                className="h-full w-10 rounded-none"
              >
                {isAllFeedsOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent className="ml-4 space-y-1">
            {feeds.map((feed) => (
              <div
                key={feed.id}
                className={`flex items-center justify-between w-full p-2 rounded-md cursor-pointer transition-colors group ${
                  selectedFeedId === feed.id
                    ? "bg-gray-100 dark:bg-gray-700"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
                onClick={() => setSelectedFeedId(feed.id)}
              >
                <span className={`flex-grow truncate mr-2 ${selectedFeedId === feed.id ? "font-semibold" : ""}`}>
                  {feed.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors opacity-0 group-hover:opacity-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenSettings(feed);
                  }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </ScrollArea>

      {/* Theme selector moved here, above the Add Feed button */}
      <div className="mt-4 mb-4">
        <Button onClick={toggleTheme} variant="outline" className="w-full justify-between">
          <span>{theme === "modern" ? "Modern" : "Newspaper"}</span>
          {theme === "modern" ? <Sun className="h-4 w-4 ml-2" /> : <Moon className="h-4 w-4 ml-2" />}
        </Button>
      </div>

      <Dialog open={isAddFeedOpen} onOpenChange={setIsAddFeedOpen}>
        <DialogTrigger asChild>
          <Button className="w-full mt-4" variant="default">
            <Plus className="mr-2 h-4 w-4" /> Add Feed
          </Button>
        </DialogTrigger>
        <AddFeedModal isOpen={isAddFeedOpen} setIsOpen={setIsAddFeedOpen} addFeed={addFeed} />
      </Dialog>
      <FeedSettingsModal
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
        editingFeed={editingFeed}
        updateFeed={updateFeed}
        deleteFeed={handleDeleteFeed}
      />
    </aside>
  );
}
