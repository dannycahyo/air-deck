import { useEffect, useRef } from "react";
import type { Keypoint } from "@tensorflow-models/pose-detection";

interface PoseKeypointsProps {
  keypoints: Keypoint[];
  videoWidth: number;
  videoHeight: number;
  isActive: boolean;
  streamWidth?: number;
  streamHeight?: number;
}

export function PoseKeypoints({
  keypoints,
  videoWidth,
  videoHeight,
  isActive,
  streamWidth = 640,
  streamHeight = 480,
}: PoseKeypointsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!isActive || keypoints.length === 0 || !canvasRef.current) {
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, videoWidth, videoHeight);

    // Apply mirror transform
    ctx.save();
    ctx.scale(-1, 1);
    ctx.translate(-videoWidth, 0);

    // Calculate scaling factors
    const scaleX = videoWidth / streamWidth;
    const scaleY = videoHeight / streamHeight;

    // Helper to transform coordinates from model space to display space
    const transformX = (x: number) => x * scaleX;
    const transformY = (y: number) => y * scaleY;

    // Filter for wrists, elbows, and shoulders
    const relevantKeypoints = keypoints.filter((kp) =>
      [
        "left_wrist",
        "right_wrist",
        "left_elbow",
        "right_elbow",
        "left_shoulder",
        "right_shoulder",
      ].includes(kp.name ?? "")
    );

    // Get color based on confidence score
    const getColor = (score?: number): string => {
      if (!score) return "#ef4444"; // red
      if (score > 0.5) return "#22c55e"; // green
      if (score > 0.3) return "#eab308"; // yellow
      return "#ef4444"; // red
    };

    // Get radius based on keypoint type
    const getRadius = (name?: string): number => {
      if (name?.includes("wrist")) return 8;
      if (name?.includes("elbow")) return 6;
      return 5; // shoulders
    };

    // Draw skeleton lines
    const drawLine = (kp1: Keypoint, kp2: Keypoint) => {
      if (
        !kp1.score ||
        !kp2.score ||
        kp1.score <= 0.3 ||
        kp2.score <= 0.3
      ) {
        return;
      }

      ctx.beginPath();
      ctx.moveTo(transformX(kp1.x), transformY(kp1.y));
      ctx.lineTo(transformX(kp2.x), transformY(kp2.y));
      ctx.strokeStyle = "#22c55e";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1.0;
    };

    // Find specific keypoints
    const leftWrist = keypoints.find((kp) => kp.name === "left_wrist");
    const leftElbow = keypoints.find((kp) => kp.name === "left_elbow");
    const leftShoulder = keypoints.find((kp) => kp.name === "left_shoulder");
    const rightWrist = keypoints.find((kp) => kp.name === "right_wrist");
    const rightElbow = keypoints.find((kp) => kp.name === "right_elbow");
    const rightShoulder = keypoints.find((kp) => kp.name === "right_shoulder");

    // Draw left arm connections
    if (leftWrist && leftElbow) {
      drawLine(leftWrist, leftElbow);
    }
    if (leftElbow && leftShoulder) {
      drawLine(leftElbow, leftShoulder);
    }

    // Draw right arm connections
    if (rightWrist && rightElbow) {
      drawLine(rightWrist, rightElbow);
    }
    if (rightElbow && rightShoulder) {
      drawLine(rightElbow, rightShoulder);
    }

    // Draw keypoints
    relevantKeypoints.forEach((kp) => {
      const x = transformX(kp.x);
      const y = transformY(kp.y);
      const radius = getRadius(kp.name);
      const color = getColor(kp.score);

      // Draw pulsing outer circle (simulate pulse with slightly larger radius)
      ctx.beginPath();
      ctx.arc(x, y, radius + 4, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.3;
      ctx.fill();
      ctx.globalAlpha = 1.0;

      // Draw main circle
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.stroke();
    });

    ctx.restore();
  }, [keypoints, videoWidth, videoHeight, isActive, streamWidth, streamHeight]);

  if (!isActive) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 pointer-events-none"
      width={videoWidth}
      height={videoHeight}
    />
  );
}
