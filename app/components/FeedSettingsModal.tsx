import React from "react";
import { FeedFormModal } from "./FeedFormModal";
import { Feed } from "@/app/types";

interface FeedSettingsModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  editingFeed: Feed | null;
  updateFeed: (id: string, url: string, name: string) => Promise<void>;
  deleteFeed: (id: string) => void;
}

export function FeedSettingsModal({ isOpen, setIsOpen, editingFeed, updateFeed, deleteFeed }: FeedSettingsModalProps) {
  const handleUpdate = async (url: string, name: string) => {
    if (editingFeed) {
      await updateFeed(editingFeed.id, url, name);
    }
  };

  return (
    <FeedFormModal
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      onSubmit={handleUpdate}
      onDelete={deleteFeed}
      initialFeed={editingFeed}
      title="Feed Settings"
    />
  );
}
