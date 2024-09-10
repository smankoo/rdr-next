import React, { useState } from "react";
import { Plus, ChevronRight, Settings, X } from "lucide-react";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Button } from "@/app/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/app/components/ui/collapsible";
import { Dialog, DialogTrigger } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Feed } from "@/app/types";
import { useResizable } from "@/app/hooks/useResizable";
import { AddFeedModal } from "./AddFeedModal";
import { FeedSettingsModal } from "./FeedSettingsModal";

interface SidebarProps {
  feeds: Feed[];
  selectedFeedId: string | null;
  setSelectedFeedId: (id: string) => void;
  deleteFeed: (id: string) => void;
  addFeed: (url: string, name: string) => Promise<void>;
  newFeedUrl: string;
  setNewFeedUrl: (url: string) => void;
  newFeedName: string;
  setNewFeedName: (name: string) => void;
  isAddFeedOpen: boolean;
  setIsAddFeedOpen: (isOpen: boolean) => void;
  setFeeds: React.Dispatch<React.SetStateAction<Feed[]>>;
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
  setFeeds,
  updateFeed,
}: SidebarProps) {
  const { width, startResizing } = useResizable(256, 200, 400);
  const [hoveredFeedId, setHoveredFeedId] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [editingFeed, setEditingFeed] = useState<Feed | null>(null);
  const [editingFeedUrl, setEditingFeedUrl] = useState("");
  const [editingFeedName, setEditingFeedName] = useState("");

  const handleOpenSettings = (feed: Feed) => {
    setEditingFeed(feed);
    setEditingFeedUrl(feed.url);
    setEditingFeedName(feed.name);
    setIsSettingsOpen(true);
  };

  const handleUpdateFeed = () => {
    if (editingFeed) {
      updateFeed(editingFeed.id, editingFeedUrl, editingFeedName);
      setIsSettingsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdateFeed();
    } else if (e.key === "Escape") {
      setIsSettingsOpen(false);
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
              className={`flex items-center justify-between w-full p-2 rounded-md cursor-pointer transition-colors group ${
                selectedFeedId === feed.id ? "bg-gray-100 dark:bg-gray-500" : "hover:bg-gray-100 dark:hover:bg-gray-500"
              }`}
              onClick={() => setSelectedFeedId(feed.id)}
            >
              <CollapsibleTrigger asChild>
                <span className={`flex-grow truncate mr-2 ${selectedFeedId === feed.id ? "font-semibold" : ""}`}>
                  {feed.name}
                </span>
              </CollapsibleTrigger>
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center">
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
              </div>
            </div>
          </Collapsible>
        ))}
      </ScrollArea>
      <Dialog open={isAddFeedOpen} onOpenChange={setIsAddFeedOpen}>
        <DialogTrigger asChild>
          <Button className="w-full mt-4" variant="default">
            <Plus className="mr-2 h-4 w-4" /> Add Feed
          </Button>
        </DialogTrigger>
        <AddFeedModal
          newFeedUrl={newFeedUrl}
          setNewFeedUrl={setNewFeedUrl}
          newFeedName={newFeedName}
          setNewFeedName={setNewFeedName}
          addFeed={addFeed}
        />
      </Dialog>
      <FeedSettingsModal
        isOpen={isSettingsOpen}
        setIsOpen={setIsSettingsOpen}
        editingFeed={editingFeed}
        updateFeed={updateFeed}
        deleteFeed={deleteFeed}
      />
    </aside>
  );
}
