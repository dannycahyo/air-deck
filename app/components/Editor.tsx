import { ChevronLeft, ChevronRight, Play, Printer } from 'lucide-react';
import { useRef } from 'react';
import { useNavigate } from 'react-router';
import * as rtp from 'react-to-print';

import { Button } from '~/components/ui/button';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable';
import { Textarea } from '~/components/ui/textarea';
import { usePresentationContext } from '~/contexts/PresentationContext';

import { SlideRenderer } from './SlideRenderer';

const useReactToPrint =
  rtp.useReactToPrint || (rtp as any).default?.useReactToPrint;

export function Editor() {
  const {
    markdownText,
    setMarkdownText,
    slides,
    currentSlide,
    totalSlides,
    nextSlide,
    prevSlide,
    goToSlide,
  } = usePresentationContext();
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const handlePresentClick = () => {
    navigate('/present');
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border bg-background px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">AirDeck</h1>
          <p className="text-sm text-muted-foreground">
            {totalSlides > 0
              ? `${totalSlides} slide${totalSlides !== 1 ? 's' : ''} | Current: ${currentSlide + 1}`
              : 'Start writing to create slides'}
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={reactToPrintFn}
            disabled={totalSlides === 0}
            size="lg"
            className="gap-2"
          >
            <Printer className="w-5 h-5" />
            Print PDF
          </Button>

          <Button
            onClick={handlePresentClick}
            disabled={totalSlides === 0}
            size="lg"
            className="gap-2"
          >
            <Play className="w-5 h-5" />
            Present
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <ResizablePanelGroup direction="horizontal" className="flex-1">
        {/* Editor Panel */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col p-6 bg-background">
            <div className="mb-4">
              <h2 className="text-lg font-semibold mb-1">Markdown Editor</h2>
              <p className="text-sm text-muted-foreground">
                Use <code className="bg-muted px-1 py-0.5 rounded">---</code> to
                separate slides
              </p>
            </div>

            <Textarea
              value={markdownText}
              onChange={(e) => setMarkdownText(e.target.value)}
              placeholder="# Welcome to AirDeck

Start writing your presentation in Markdown...

---

# Second Slide

Use --- to create new slides"
              className="flex-1 font-mono resize-none"
            />
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        {/* Preview Panel */}
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full flex flex-col bg-muted/30">
            <div className="border-b border-border px-6 py-4 bg-background">
              <h2 className="text-lg font-semibold">
                Preview {totalSlides > 0 ? `- Slide ${currentSlide + 1}` : ''}
              </h2>
            </div>

            <div className="flex-1 overflow-auto">
              {slides.length > 0 ? (
                <SlideRenderer markdown={slides[currentSlide]} />
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <p className="text-lg mb-2">No slides yet</p>
                    <p className="text-sm">
                      Start typing in the editor to see your presentation
                    </p>
                  </div>
                </div>
              )}
            </div>
            {totalSlides > 1 && (
              <div className="border-t border-border px-6 py-3 bg-background flex items-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevSlide}
                  disabled={currentSlide === 0}
                  className="gap-1 shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                <div className="flex-1 overflow-x-auto scrollbar-hide">
                  <div className="flex gap-1.5 items-center justify-center min-w-max px-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`h-2 w-8 rounded-full transition-all hover:scale-110 shrink-0 ${
                          index === currentSlide
                            ? 'bg-primary'
                            : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextSlide}
                  disabled={currentSlide === totalSlides - 1}
                  className="gap-1 shrink-0"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {/* Hidden Print Container */}
      <div className="hidden">
        <div ref={contentRef}>
          {slides.map((slide, index) => (
            <div key={index} className="break-after-page h-screen w-screen">
              <SlideRenderer
                markdown={slide}
                className="h-full overflow-visible"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
