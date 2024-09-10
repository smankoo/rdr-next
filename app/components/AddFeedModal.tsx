import React from "react";
import { DialogContent, DialogHeader, DialogTitle } from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

interface AddFeedModalProps {
  newFeedUrl: string;
  setNewFeedUrl: (url: string) => void;
  newFeedName: string;
  setNewFeedName: (name: string) => void;
  addFeed: (url: string, name: string) => Promise<void>;
}

export function AddFeedModal({ newFeedUrl, setNewFeedUrl, newFeedName, setNewFeedName, addFeed }: AddFeedModalProps) {
  return (
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
  );
}
