import { useState, useEffect } from "react";

interface UserPreferences {
  theme: "modern" | "newspaper";
  selectedFeedId: string | null;
  displayMode: "list" | "grid";
  activeFilter: "All Articles" | "Unread";
}

const defaultPreferences: UserPreferences = {
  theme: "modern",
  selectedFeedId: null,
  displayMode: "list",
  activeFilter: "All Articles",
};

export function useUserPreferences(): [UserPreferences, (key: keyof UserPreferences, value: any) => void] {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadPreferences = () => {
      const storedPreferences = localStorage.getItem("userPreferences");
      if (storedPreferences) {
        setPreferences(JSON.parse(storedPreferences));
      }
      setIsLoaded(true);
    };

    loadPreferences();
  }, []);

  const updatePreference = (key: keyof UserPreferences, value: any) => {
    setPreferences((prev) => {
      const newPreferences = { ...prev, [key]: value };
      localStorage.setItem("userPreferences", JSON.stringify(newPreferences));
      return newPreferences;
    });
  };

  return [preferences, updatePreference, isLoaded];
}
