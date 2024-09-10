import React, { FormEvent } from "react";
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
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    addFeed(newFeedUrl, newFeedName);
  };

  return (
    <DialogContent className="bg-white p-6">
      <DialogHeader className="mb-6">
        <DialogTitle>Add New Feed</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          value={newFeedUrl}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFeedUrl(e.target.value)}
          placeholder="Feed URL"
        />
        <Input
          value={newFeedName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFeedName(e.target.value)}
          placeholder="Feed Name (optional)"
        />
        <div className="flex justify-end pt-4">
          <Button type="submit">Add Feed</Button>
        </div>
      </form>
    </DialogContent>
  );
}
