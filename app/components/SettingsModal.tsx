import React from "react";
import { BaseModal } from "./BaseModal";
import { Label } from "@/app/components/ui/label";
import { Switch } from "@/app/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/app/components/ui/radio-group";
import { Button } from "@/app/components/ui/button";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  theme: "modern" | "newspaper";
  setTheme: (theme: "modern" | "newspaper") => void;
  displayMode: "list" | "grid";
  setDisplayMode: (mode: "list" | "grid") => void;
}

export function SettingsModal({ isOpen, onClose, theme, setTheme, displayMode, setDisplayMode }: SettingsModalProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Settings"
      footer={
        <Button onClick={onClose} className="w-full">
          Close
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="theme" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Theme
          </Label>
          <RadioGroup
            id="theme"
            value={theme}
            onValueChange={(value: "modern" | "newspaper") => setTheme(value)}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="modern" id="modern" />
              <Label htmlFor="modern">Modern</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="newspaper" id="newspaper" />
              <Label htmlFor="newspaper">Newspaper</Label>
            </div>
          </RadioGroup>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="display-mode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Display Mode
          </Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="display-mode"
              checked={displayMode === "grid"}
              onCheckedChange={(checked: boolean) => setDisplayMode(checked ? "grid" : "list")}
            />
            <Label htmlFor="display-mode">{displayMode === "grid" ? "Grid" : "List"}</Label>
          </div>
        </div>
      </div>
    </BaseModal>
  );
}
