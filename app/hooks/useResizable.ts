import { useState, useCallback, useEffect } from "react";

export function useResizable(initialWidth: number, minWidth: number, maxWidth: number) {
  const [width, setWidth] = useState(() => {
    const savedWidth = localStorage.getItem("sidebarWidth");
    return savedWidth ? Math.max(minWidth, Math.min(parseInt(savedWidth, 10), maxWidth)) : initialWidth;
  });

  useEffect(() => {
    localStorage.setItem("sidebarWidth", width.toString());
  }, [width]);

  const startResizing = useCallback(
    (mouseDownEvent: React.MouseEvent) => {
      const startX = mouseDownEvent.clientX;
      const startWidth = width;

      const doDrag = (mouseMoveEvent: MouseEvent) => {
        const newWidth = startWidth + mouseMoveEvent.clientX - startX;
        setWidth(Math.max(minWidth, Math.min(newWidth, maxWidth)));
      };

      const stopDrag = () => {
        document.removeEventListener("mousemove", doDrag);
        document.removeEventListener("mouseup", stopDrag);
      };

      document.addEventListener("mousemove", doDrag);
      document.addEventListener("mouseup", stopDrag);
    },
    [width, minWidth, maxWidth]
  );

  return { width, startResizing, setWidth };
}
