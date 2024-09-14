import { useCallback } from "react";

export function useResizable(currentWidth: number, minWidth: number, maxWidth: number) {
  const handleResize = useCallback(
    (clientX: number) => {
      return Math.max(minWidth, Math.min(clientX, maxWidth));
    },
    [minWidth, maxWidth]
  );

  return { handleResize };
}
