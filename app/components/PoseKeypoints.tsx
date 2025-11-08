import type { Keypoint } from "@tensorflow-models/pose-detection";

interface PoseKeypointsProps {
  keypoints: Keypoint[];
  videoWidth: number;
  videoHeight: number;
  isActive: boolean;
}

export function PoseKeypoints({
  keypoints,
  videoWidth,
  videoHeight,
  isActive,
}: PoseKeypointsProps) {
  if (!isActive || keypoints.length === 0) {
    return null;
  }

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

  return (
    <svg
      className="absolute top-0 left-0 pointer-events-none"
      width={videoWidth}
      height={videoHeight}
      style={{ transform: "scaleX(-1)" }}
    >
      {/* Draw lines connecting keypoints */}
      {(() => {
        const leftWrist = keypoints.find((kp) => kp.name === "left_wrist");
        const leftElbow = keypoints.find((kp) => kp.name === "left_elbow");
        const leftShoulder = keypoints.find(
          (kp) => kp.name === "left_shoulder"
        );
        const rightWrist = keypoints.find((kp) => kp.name === "right_wrist");
        const rightElbow = keypoints.find((kp) => kp.name === "right_elbow");
        const rightShoulder = keypoints.find(
          (kp) => kp.name === "right_shoulder"
        );

        const lines = [];

        // Left arm
        if (
          leftWrist &&
          leftElbow &&
          leftWrist.score &&
          leftWrist.score > 0.3 &&
          leftElbow.score &&
          leftElbow.score > 0.3
        ) {
          lines.push(
            <line
              key="left-wrist-elbow"
              x1={leftWrist.x}
              y1={leftWrist.y}
              x2={leftElbow.x}
              y2={leftElbow.y}
              stroke="#22c55e"
              strokeWidth="2"
              opacity="0.6"
            />
          );
        }

        if (
          leftElbow &&
          leftShoulder &&
          leftElbow.score &&
          leftElbow.score > 0.3 &&
          leftShoulder.score &&
          leftShoulder.score > 0.3
        ) {
          lines.push(
            <line
              key="left-elbow-shoulder"
              x1={leftElbow.x}
              y1={leftElbow.y}
              x2={leftShoulder.x}
              y2={leftShoulder.y}
              stroke="#22c55e"
              strokeWidth="2"
              opacity="0.6"
            />
          );
        }

        // Right arm
        if (
          rightWrist &&
          rightElbow &&
          rightWrist.score &&
          rightWrist.score > 0.3 &&
          rightElbow.score &&
          rightElbow.score > 0.3
        ) {
          lines.push(
            <line
              key="right-wrist-elbow"
              x1={rightWrist.x}
              y1={rightWrist.y}
              x2={rightElbow.x}
              y2={rightElbow.y}
              stroke="#22c55e"
              strokeWidth="2"
              opacity="0.6"
            />
          );
        }

        if (
          rightElbow &&
          rightShoulder &&
          rightElbow.score &&
          rightElbow.score > 0.3 &&
          rightShoulder.score &&
          rightShoulder.score > 0.3
        ) {
          lines.push(
            <line
              key="right-elbow-shoulder"
              x1={rightElbow.x}
              y1={rightElbow.y}
              x2={rightShoulder.x}
              y2={rightShoulder.y}
              stroke="#22c55e"
              strokeWidth="2"
              opacity="0.6"
            />
          );
        }

        return lines;
      })()}

      {/* Draw keypoints */}
      {relevantKeypoints.map((kp, idx) => (
        <g key={idx}>
          {/* Pulsing animation circle */}
          <circle
            cx={kp.x}
            cy={kp.y}
            r={getRadius(kp.name) + 4}
            fill={getColor(kp.score)}
            opacity="0.3"
            className="animate-pulse"
          />
          {/* Main circle */}
          <circle
            cx={kp.x}
            cy={kp.y}
            r={getRadius(kp.name)}
            fill={getColor(kp.score)}
            stroke="white"
            strokeWidth="2"
          />
        </g>
      ))}
    </svg>
  );
}
