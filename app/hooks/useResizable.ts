import { useState, useEffect } from "react";

export function useResizable(initialWidth: number, minWidth: number, maxWidth: number) {
  const [width, setWidth] = useState(initialWidth);

  useEffect(() => {
    const savedWidth = localStorage.getItem("sidebarWidth");
    if (savedWidth) {
      setWidth(Math.max(minWidth, Math.min(parseInt(savedWidth, 10), maxWidth)));
    }
  }, [minWidth, maxWidth]);

  const handleResize = (newWidth: number) => {
    const clampedWidth = Math.max(minWidth, Math.min(newWidth, maxWidth));
    setWidth(clampedWidth);
    localStorage.setItem("sidebarWidth", clampedWidth.toString());
  };

  return { width, handleResize };
}
