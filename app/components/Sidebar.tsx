import React, { useState } from "react";
import { Plus, ChevronRight, Settings, X } from "lucide-react";
import { ScrollArea } from "@/app/components/ui/scroll-area";
import { Button } from "@/app/components/ui/button";
import { Collapsible, CollapsibleTrigger } from "@/app/components/ui/collapsible";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Feed } from "@/app/types";
import { useResizable } from "@/app/hooks/useResizable";

interface SidebarProps {
  feeds: Feed[];
  selectedFeedId: string | null;
  setSelectedFeedId: (id: string) => void;
  deleteFeed: (id: string) => void;
  addFeed: (url: string, name: string) => Promise<void>; // Update this line
  newFeedUrl: string;
  setNewFeedUrl: (url: string) => void;
  newFeedName: string;
  setNewFeedName: (name: string) => void;
  isAddFeedOpen: boolean;
  setIsAddFeedOpen: (isOpen: boolean) => void;
  setFeeds: React.Dispatch<React.SetStateAction<Feed[]>>; // Add this line
  updateFeed: (id: string, url: string, name: string) => Promise<void>; // Add this line
}

export function Sidebar({
  feeds,
  selectedFeedId,
  setSelectedFeedId,
  deleteFeed,
  addFeed, // Update this line
  newFeedUrl,
  setNewFeedUrl,
  newFeedName,
  setNewFeedName,
  isAddFeedOpen,
  setIsAddFeedOpen,
  setFeeds, // Add this line
  updateFeed, // Add this line
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
              className={`flex items-center justify-between w-full p-2 hover:bg-accent rounded-md cursor-pointer ${
                selectedFeedId === feed.id ? "bg-accent" : ""
              }`}
              onClick={() => setSelectedFeedId(feed.id)}
              onMouseEnter={() => setHoveredFeedId(feed.id)}
              onMouseLeave={() => setHoveredFeedId(null)}
            >
              <CollapsibleTrigger asChild>
                <span
                  className={`flex-grow truncate mr-2 ${
                    selectedFeedId === feed.id ? "font-semibold text-primary" : ""
                  }`}
                >
                  {feed.name}
                </span>
              </CollapsibleTrigger>
              <div className="flex items-center">
                <div className="w-8 h-8 flex items-center justify-center">
                  {hoveredFeedId === feed.id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 text-gray-400 hover:text-gray-700 transition-colors"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenSettings(feed);
                      }}
                    >
                      <Settings className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {/* <ChevronRight className="h-4 w-4 ml-1" /> */}
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
          <Button onClick={() => addFeed(newFeedUrl, newFeedName)}>Add Feed</Button>
        </DialogContent>
      </Dialog>
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="bg-white">
          <DialogHeader>
            <DialogTitle>Feed Settings</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSettingsOpen(false)}
              className="absolute right-4 top-4"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <Input
            value={editingFeedUrl}
            onChange={(e) => setEditingFeedUrl(e.target.value)}
            placeholder="Feed URL"
            className="mb-2"
            onKeyDown={handleKeyDown}
          />
          <Input
            value={editingFeedName}
            onChange={(e) => setEditingFeedName(e.target.value)}
            placeholder="Feed Name"
            className="mb-2"
            onKeyDown={handleKeyDown}
          />
          <div className="flex justify-between">
            <Button variant="destructive" onClick={() => editingFeed && deleteFeed(editingFeed.id)}>
              Delete
            </Button>
            <div>
              <Button variant="outline" onClick={() => setIsSettingsOpen(false)} className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleUpdateFeed}>Update</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
