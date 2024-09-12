import React from "react";
import { FeedFormModal } from "./FeedFormModal";

interface AddFeedModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addFeed: (url: string, name: string) => Promise<void>;
}

export function AddFeedModal({ isOpen, setIsOpen, addFeed }: AddFeedModalProps) {
  return <FeedFormModal isOpen={isOpen} setIsOpen={setIsOpen} onSubmit={addFeed} title="Add New Feed" />;
}
