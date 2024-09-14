import React, { useState } from "react";
import { Search, Settings, RefreshCw, List, Grid } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { getPlaceholderImage } from "@/app/lib/imageUtils";
import { timeAgo } from "@/app/lib/utils";

interface HeaderProps {
  feedName: string;
  filterButtons: React.ReactNode;
  lastRefreshed: Date | null;
  handleRefreshFeeds: () => Promise<void>;
  displayMode: "list" | "grid";
  toggleDisplayMode: () => void;
}

export function Header({
  feedName,
  filterButtons,
  lastRefreshed,
  handleRefreshFeeds,
  displayMode,
  toggleDisplayMode,
}: HeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await handleRefreshFeeds();
    } catch (error) {
      console.error("Error refreshing feeds:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b shadow-sm">
      <div className="flex items-center space-x-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-indigo-700">Reader</h1>
          <h2 className="text-sm font-medium text-indigo-500 mt-1">{feedName}</h2>
          {lastRefreshed && <p className="text-xs text-gray-500 mt-1">Last refreshed {timeAgo(lastRefreshed)}</p>}
        </div>
        <div className="h-8 w-px bg-indigo-200 mx-4" />
        {filterButtons}
      </div>
      <div className="flex items-center space-x-4">
        <Button
          onClick={toggleDisplayMode}
          variant="ghost"
          size="sm"
          className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100"
        >
          {displayMode === "list" ? (
            <>
              <Grid className="h-4 w-4 mr-2" />
              <span>Grid</span>
            </>
          ) : (
            <>
              <List className="h-4 w-4 mr-2" />
              <span>List</span>
            </>
          )}
        </Button>
        <Button
          onClick={handleRefresh}
          variant="ghost"
          size="sm"
          className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100"
          disabled={isRefreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100">
          <Search className="h-4 w-4 mr-2" />
          <span>Search</span>
        </Button>
        <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-100">
          <Settings className="h-4 w-4 mr-2" />
          <span>Settings</span>
        </Button>
        <Avatar className="h-9 w-9 ring-2 ring-indigo-200">
          <AvatarImage src={getPlaceholderImage(40, "User")} alt="User" />
          <AvatarFallback className="bg-indigo-100 text-indigo-700">U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
