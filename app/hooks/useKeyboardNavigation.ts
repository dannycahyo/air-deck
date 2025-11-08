import { useEffect } from "react";

interface UseKeyboardNavigationOptions {
  onNext: () => void;
  onPrevious: () => void;
  onExit?: () => void;
  enabled?: boolean;
  customHandlers?: Record<string, () => void>;
}

export function useKeyboardNavigation({
  onNext,
  onPrevious,
  onExit,
  enabled = true,
  customHandlers = {},
}: UseKeyboardNavigationOptions) {
  useEffect(() => {
    if (!enabled) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Check custom handlers first
      if (customHandlers[event.key]) {
        event.preventDefault();
        customHandlers[event.key]();
        return;
      }

      switch (event.key) {
        case "ArrowRight":
        case "PageDown":
        case " ": // Spacebar
          event.preventDefault();
          onNext();
          break;

        case "ArrowLeft":
        case "PageUp":
          event.preventDefault();
          onPrevious();
          break;

        case "Escape":
          event.preventDefault();
          onExit?.();
          break;

        case "Home":
          event.preventDefault();
          // This could be enhanced to go to first slide
          break;

        case "End":
          event.preventDefault();
          // This could be enhanced to go to last slide
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [enabled, onNext, onPrevious, onExit, customHandlers]);
}
