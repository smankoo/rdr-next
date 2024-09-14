import React, { useState } from "react";
import { Input } from "@/app/components/ui/input";

interface FeedFormProps {
  onSubmit: (url: string, name: string) => Promise<void>;
  id?: string;
}

export function FeedForm({ onSubmit, id }: FeedFormProps) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(url, name);
  };

  return (
    <form onSubmit={handleSubmit} id={id}>
      <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Feed URL" className="mb-4" />
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Feed Name (optional)"
        className="mb-4"
      />
    </form>
  );
}
