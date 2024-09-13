import { Theme } from "../contexts/ThemeContext";

export const getThemeClasses = (theme: Theme) => {
  return theme === "newspaper"
    ? "font-serif text-gray-900 dark:text-gray-100"
    : "font-sans text-gray-800 dark:text-gray-200";
};
