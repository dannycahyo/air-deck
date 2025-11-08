import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { SlideRenderer } from './SlideRenderer';
import { GestureFeedback } from './GestureFeedback';
import { PoseKeypoints } from './PoseKeypoints';
import { usePresentationContext } from '~/contexts/PresentationContext';
import { useGestureDetection } from '~/hooks/useGestureDetection';
import { useKeyboardNavigation } from '~/hooks/useKeyboardNavigation';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '~/components/ui/alert';
import { AlertCircle, Loader2, Maximize, Camera, CameraOff } from 'lucide-react';
import { Button } from '~/components/ui/button';
import type { GestureType } from '~/services/gestureDetection';

export function PresentationView() {
  const { slides, currentSlide, nextSlide, prevSlide, totalSlides } =
    usePresentationContext();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showCamera, setShowCamera] = useState(false);

  const handleGesture = useCallback(
    (gesture: GestureType) => {
      if (gesture === 'swipe-right') {
        nextSlide();
      } else if (gesture === 'swipe-left') {
        prevSlide();
      }
    },
    [nextSlide, prevSlide],
  );

  const { isLoading, error, isActive, lastGesture, videoRef, keypoints } =
    useGestureDetection({
      enabled: true,
      onGesture: handleGesture,
    });

  useKeyboardNavigation({
    onNext: nextSlide,
    onPrevious: prevSlide,
    onExit: () => {
      exitFullscreen();
      navigate('/');
    },
    enabled: true,
    customHandlers: {
      c: () => setShowCamera((prev) => !prev),
      C: () => setShowCamera((prev) => !prev),
    },
  });

  const enterFullscreen = async () => {
    try {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } catch (err) {
      console.error('Failed to enter fullscreen:', err);
    }
  };

  const exitFullscreen = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
      setIsFullscreen(false);
    } catch (err) {
      console.error('Failed to exit fullscreen:', err);
    }
  };

  useEffect(() => {
    enterFullscreen();

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener(
      'fullscreenchange',
      handleFullscreenChange,
    );

    return () => {
      document.removeEventListener(
        'fullscreenchange',
        handleFullscreenChange,
      );
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  if (totalSlides === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            No slides to present
          </h1>
          <p className="text-muted-foreground mb-6">
            Please create some slides first
          </p>
          <Button onClick={() => navigate('/')}>Go to Editor</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background relative overflow-hidden">
      {/* Camera video container - always rendered, position changes based on showCamera */}
      <div
        className={`${
          showCamera
            ? 'fixed top-6 right-6 z-50'
            : 'absolute top-0 left-0 -z-10'
        } transition-all duration-300`}
      >
        <div
          className={`relative ${
            showCamera
              ? 'rounded-lg overflow-hidden border-2 border-primary shadow-2xl'
              : ''
          }`}
        >
          <video
            ref={videoRef}
            className={`${
              showCamera
                ? 'w-[320px] h-[240px] object-cover'
                : 'w-0 h-0 opacity-0'
            }`}
            style={showCamera ? { transform: 'scaleX(-1)' } : undefined}
            playsInline
            muted
          />
          {showCamera && (
            <PoseKeypoints
              keypoints={keypoints}
              videoWidth={320}
              videoHeight={240}
              isActive={isActive}
            />
          )}
        </div>
      </div>

      {isLoading && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium">
              Loading AI gesture controls...
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              You can use arrow keys to navigate
            </p>
          </div>
        </div>
      )}

      {error && !isLoading && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Gesture Controls Unavailable</AlertTitle>
            <AlertDescription className="text-sm">
              {error}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="h-full w-full">
        <SlideRenderer
          markdown={slides[currentSlide]}
          className="bg-background"
        />
      </div>

      <div className="fixed bottom-6 right-6 z-50">
        <div className="px-4 py-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg">
          <span className="text-sm font-medium">
            {currentSlide + 1} / {totalSlides}
          </span>
        </div>
      </div>

      <GestureFeedback
        isActive={isActive}
        lastGesture={lastGesture}
      />

      {/* Control buttons - top-left */}
      <div className="fixed top-6 left-6 z-50 flex gap-2">
        <Button
          onClick={() => setShowCamera((prev) => !prev)}
          variant="outline"
          size="sm"
          className="bg-background/80 backdrop-blur-sm border shadow-lg"
          title={showCamera ? 'Hide camera (C)' : 'Show camera (C)'}
        >
          {showCamera ? (
            <CameraOff className="w-4 h-4" />
          ) : (
            <Camera className="w-4 h-4" />
          )}
        </Button>
        {!isFullscreen ? (
          <Button
            onClick={enterFullscreen}
            variant="outline"
            size="sm"
            className="bg-background/80 backdrop-blur-sm border shadow-lg"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        ) : (
          <div className="px-3 py-2 rounded bg-background/80 backdrop-blur-sm border shadow-lg text-xs text-muted-foreground flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">ESC</kbd>
          </div>
        )}
      </div>

      {totalSlides > 1 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
          <div className="flex gap-1.5 px-3 py-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-lg">
            {slides.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 transition-all rounded-full ${
                  index === currentSlide
                    ? 'w-8 bg-primary'
                    : 'w-1.5 bg-muted-foreground/30'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
