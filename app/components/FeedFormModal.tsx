import React, { FormEvent, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import { Feed } from "@/app/types";

interface FeedFormModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSubmit: (url: string, name: string) => Promise<void>;
  onDelete?: (id: string) => void;
  initialFeed?: Feed | null;
  title: string;
}

export function FeedFormModal({ isOpen, setIsOpen, onSubmit, onDelete, initialFeed, title }: FeedFormModalProps) {
  const [feedUrl, setFeedUrl] = useState("");
  const [feedName, setFeedName] = useState("");

  useEffect(() => {
    if (initialFeed) {
      setFeedUrl(initialFeed.url);
      setFeedName(initialFeed.name);
    } else {
      setFeedUrl("");
      setFeedName("");
    }
  }, [initialFeed]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(feedUrl, feedName);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const handleDelete = () => {
    if (initialFeed && onDelete) {
      onDelete(initialFeed.id);
      setIsOpen(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-white p-6">
        <DialogHeader className="mb-6">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={feedUrl}
            onChange={(e) => setFeedUrl(e.target.value)}
            placeholder="Feed URL"
            onKeyDown={handleKeyDown}
          />
          <Input
            value={feedName}
            onChange={(e) => setFeedName(e.target.value)}
            placeholder="Feed Name (optional)"
            onKeyDown={handleKeyDown}
          />
          <div className="flex justify-between pt-4">
            {initialFeed && onDelete && (
              <Button type="button" variant="destructive" onClick={handleDelete}>
                Delete
              </Button>
            )}
            <div className="ml-auto">
              <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="mr-2">
                Cancel
              </Button>
              <Button type="submit">{initialFeed ? "Update" : "Add"} Feed</Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
