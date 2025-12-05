import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import type { ReactNode } from 'react';

interface PresentationContextType {
  markdownText: string;
  setMarkdownText: (text: string) => void;
  slides: string[];
  currentSlide: number;
  nextSlide: () => void;
  prevSlide: () => void;
  goToSlide: (index: number) => void;
  totalSlides: number;
}

const PresentationContext = createContext<PresentationContextType | undefined>(
  undefined
);

export function usePresentationContext() {
  const context = useContext(PresentationContext);
  if (!context) {
    throw new Error(
      'usePresentationContext must be used within a PresentationProvider'
    );
  }
  return context;
}

interface PresentationProviderProps {
  children: ReactNode;
  initialMarkdown?: string;
}

export function PresentationProvider({
  children,
  initialMarkdown = '',
}: PresentationProviderProps) {
  const [markdownText, setMarkdownText] = useState(initialMarkdown);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('airdeck-markdown');
    if (saved) {
      setMarkdownText(saved);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage when markdownText changes, but only after initial load
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('airdeck-markdown', markdownText);
    }
  }, [markdownText, isLoaded]);

  const slides = useMemo(
    () =>
      markdownText
        .split(/\n---\n/)
        .map((slide) => slide.trim())
        .filter((slide) => slide.length > 0),
    [markdownText]
  );

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToSlide = useCallback(
    (index: number) => {
      if (index >= 0 && index < totalSlides) {
        setCurrentSlide(index);
      }
    },
    [totalSlides]
  );

  return (
    <PresentationContext.Provider
      value={{
        markdownText,
        setMarkdownText,
        slides,
        currentSlide,
        nextSlide,
        prevSlide,
        goToSlide,
        totalSlides,
      }}
    >
      {children}
    </PresentationContext.Provider>
  );
}
