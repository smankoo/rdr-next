"use client";

import React from "react";
import { Button } from "@/app/components/ui/button";

interface FilterButtonsProps {
  activeFilter: "All Articles" | "Unread";
  handleSetActiveFilter: (filter: "All Articles" | "Unread") => void;
}

export function FilterButtons({ activeFilter, handleSetActiveFilter }: FilterButtonsProps) {
  return (
    <>
      {["All Articles", "Unread"].map((filter) => (
        <Button
          key={filter}
          variant={activeFilter === filter ? "default" : "outline"}
          onClick={() => handleSetActiveFilter(filter as "All Articles" | "Unread")}
        >
          {filter}
        </Button>
      ))}
    </>
  );
}
