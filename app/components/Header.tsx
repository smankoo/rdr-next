import React from "react";
import { Search, Settings, RefreshCw } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { getPlaceholderImage } from "@/app/lib/imageUtils";
import { timeAgo } from "@/app/lib/utils"; // Import the timeAgo function
import { useState } from "react";

interface HeaderProps {
  feedName: string;
  filterButtons: React.ReactNode;
  lastRefreshed: Date | null; // Change this to allow null
  refreshArticles: () => Promise<void>;
}

export function Header({ feedName, filterButtons, lastRefreshed, refreshArticles }: HeaderProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refreshArticles();
    } catch (error) {
      console.error("Error refreshing articles:", error);
      // You might want to show an error message to the user here
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center space-x-4">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-indigo-700">Reader</h1>
          <h2 className="text-sm font-medium text-indigo-500 mt-1">{feedName}</h2>
          {lastRefreshed && <p className="text-xs text-gray-500 mt-1">Last refreshed {timeAgo(lastRefreshed)}</p>}
        </div>
        <div className="h-8 w-px bg-indigo-200 mx-2" />
        {filterButtons}
      </div>
      <div className="flex items-center space-x-3">
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
        <button
          onClick={handleRefresh}
          className={`p-2 rounded-full hover:bg-gray-100 ${isRefreshing ? "animate-spin" : ""}`}
          disabled={isRefreshing}
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
