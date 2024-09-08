import React from "react";
import { Search, Settings } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 border-b">
      <h1 className="text-2xl font-bold">Reader App</h1>
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon">
          <Search className="h-5 w-5" />
          <span className="sr-only">Search</span>
        </Button>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Button>
        <Avatar>
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
