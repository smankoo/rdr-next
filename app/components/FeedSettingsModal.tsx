import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Feed } from "@/app/types";

interface FeedSettingsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editingFeed: Feed | null;
  updateFeed: (id: string, url: string, name: string) => Promise<void>;
  deleteFeed: (id: string) => void;
}

export function FeedSettingsModal({ isOpen, setIsOpen, editingFeed, updateFeed, deleteFeed }: FeedSettingsModalProps) {
  const [editingFeedUrl, setEditingFeedUrl] = useState("");
  const [editingFeedName, setEditingFeedName] = useState("");

  useEffect(() => {
    if (editingFeed) {
      setEditingFeedUrl(editingFeed.url);
      setEditingFeedName(editingFeed.name);
    }
  }, [editingFeed]);

  const handleUpdateFeed = () => {
    if (editingFeed) {
      updateFeed(editingFeed.id, editingFeedUrl, editingFeedName);
      setIsOpen(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdateFeed();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleDeleteFeed = () => {
    if (editingFeed) {
      deleteFeed(editingFeed.id);
      setIsOpen(false); // Close the modal after deleting
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Feed Settings</DialogTitle>
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
          <Button variant="destructive" onClick={handleDeleteFeed}>
            Delete
          </Button>
          <div>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="mr-2">
              Cancel
            </Button>
            <Button onClick={handleUpdateFeed}>Update</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
