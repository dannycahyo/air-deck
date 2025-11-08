import { useEffect, useRef, useState, useCallback } from 'react';
import { GestureDetectionService } from '~/services/gestureDetection';
import type {
  GestureType,
  GestureDetectionConfig,
} from '~/services/gestureDetection';
import type { Keypoint } from '@tensorflow-models/pose-detection';

interface UseGestureDetectionOptions {
  enabled?: boolean;
  config?: Partial<GestureDetectionConfig>;
  onGesture?: (gesture: GestureType) => void;
}

interface UseGestureDetectionReturn {
  isLoading: boolean;
  error: string | null;
  isActive: boolean;
  lastGesture: GestureType;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  keypoints: Keypoint[];
}

export function useGestureDetection({
  enabled = true,
  config,
  onGesture,
}: UseGestureDetectionOptions = {}): UseGestureDetectionReturn {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [lastGesture, setLastGesture] = useState<GestureType>(null);
  const [keypoints, setKeypoints] = useState<Keypoint[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const serviceRef = useRef<GestureDetectionService | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const detectGestureLoop = useCallback(async () => {
    if (!videoRef.current || !serviceRef.current || !enabled) {
      return;
    }

    try {
      const gesture = await serviceRef.current.detectGesture(
        videoRef.current,
      );

      if (gesture) {
        setLastGesture(gesture);
        onGesture?.(gesture);
      }

      // Update keypoints for visualization
      const detectedKeypoints = serviceRef.current.getLastKeypoints();
      setKeypoints(detectedKeypoints);
    } catch (err) {
      console.error('Error in gesture detection loop:', err);
    }

    animationFrameRef.current =
      requestAnimationFrame(detectGestureLoop);
  }, [enabled, onGesture]);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;

        // Wait for video to be ready
        await new Promise<void>((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play();
              resolve();
            };
          }
        });

        return true;
      }

      return false;
    } catch (err) {
      console.error('Failed to start camera:', err);
      setError(
        'Camera access denied. Please grant camera permissions to use gesture controls.',
      );
      return false;
    }
  }, []);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let mounted = true;

    const initialize = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const cameraStarted = await startCamera();
        if (!cameraStarted) {
          return;
        }

        if (!mounted) {
          return;
        }

        serviceRef.current = new GestureDetectionService(config);
        await serviceRef.current.initializeWithTimeout(30000);

        if (mounted) {
          setIsActive(true);

          // Start detection loop
          detectGestureLoop();
        }
      } catch (err) {
        console.error('Failed to initialize gesture detection:', err);
        if (mounted) {
          setError(
            'Failed to load AI model. Gesture controls are disabled, but you can still use arrow keys.',
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;

      // Cancel animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      // Stop camera stream
      if (streamRef.current) {
        streamRef.current
          .getTracks()
          .forEach((track) => track.stop());
      }

      // Dispose gesture detection service
      if (serviceRef.current) {
        serviceRef.current.dispose();
      }
    };
  }, [enabled, config, detectGestureLoop, startCamera]);

  return {
    isLoading,
    error,
    isActive,
    lastGesture,
    videoRef,
    keypoints,
  };
}
