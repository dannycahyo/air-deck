import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";

export type GestureType = "swipe-right" | "swipe-left" | null;

export interface GestureDetectionConfig {
  swipeThreshold: number;
  cooldownMs: number;
  minConfidence: number;
}

export const DEFAULT_CONFIG: GestureDetectionConfig = {
  swipeThreshold: 50, // Minimum pixel movement to trigger swipe
  cooldownMs: 800, // Cooldown between gesture detections
  minConfidence: 0.3, // Minimum confidence score for keypoint
};

export class GestureDetectionService {
  private detector: poseDetection.PoseDetector | null = null;
  private prevWristPositions: { left: number; right: number } = {
    left: 0,
    right: 0,
  };
  private isOnCooldown = false;
  private config: GestureDetectionConfig;
  private lastKeypoints: poseDetection.Keypoint[] = [];

  constructor(config: Partial<GestureDetectionConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  async initialize() {
    try {
      console.log("1. Starting TensorFlow.js initialization...");

      // Ensure TensorFlow.js is ready
      await tf.ready();

      console.log("2. TensorFlow.js ready! Loading MoveNet model...");

      // Create detector with MoveNet Lightning model (fastest)
      this.detector = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING,
        }
      );

      console.log("3. MoveNet model loaded successfully!");

      return true;
    } catch (error) {
      console.error("Failed to initialize pose detector:", error);
      throw error;
    }
  }

  async initializeWithTimeout(timeoutMs = 30000): Promise<boolean> {
    console.log(`Starting model initialization with ${timeoutMs}ms timeout...`);

    return Promise.race([
      this.initialize(),
      new Promise<boolean>((_, reject) =>
        setTimeout(() => {
          const error = new Error(
            `Model loading timeout after ${timeoutMs / 1000} seconds. This may be due to slow network or TensorFlow.js initialization issues.`
          );
          console.error("Initialization timeout:", error);
          reject(error);
        }, timeoutMs)
      ),
    ]);
  }

  async detectGesture(
    videoElement: HTMLVideoElement
  ): Promise<GestureType | null> {
    if (!this.detector || this.isOnCooldown) {
      return null;
    }

    try {
      const poses = await this.detector.estimatePoses(videoElement);

      if (poses.length === 0) {
        return null;
      }

      const pose = poses[0];
      const keypoints = pose.keypoints;

      // Store keypoints for visualization
      this.lastKeypoints = keypoints;

      // MoveNet keypoint indices:
      // 9 = left_wrist, 10 = right_wrist
      const leftWrist = keypoints.find((kp) => kp.name === "left_wrist");
      const rightWrist = keypoints.find((kp) => kp.name === "right_wrist");

      if (!leftWrist || !rightWrist) {
        return null;
      }

      // Detect swipe right (right hand moving right)
      if (rightWrist.score && rightWrist.score > this.config.minConfidence) {
        const deltaX = rightWrist.x - this.prevWristPositions.right;

        if (deltaX > this.config.swipeThreshold) {
          this.prevWristPositions.right = rightWrist.x;
          this.startCooldown();
          return "swipe-right";
        }

        this.prevWristPositions.right = rightWrist.x;
      }

      // Detect swipe left (left hand moving left)
      if (leftWrist.score && leftWrist.score > this.config.minConfidence) {
        const deltaX = leftWrist.x - this.prevWristPositions.left;

        if (deltaX < -this.config.swipeThreshold) {
          this.prevWristPositions.left = leftWrist.x;
          this.startCooldown();
          return "swipe-left";
        }

        this.prevWristPositions.left = leftWrist.x;
      }

      return null;
    } catch (error) {
      console.error("Error detecting gesture:", error);
      return null;
    }
  }

  private startCooldown() {
    this.isOnCooldown = true;
    setTimeout(() => {
      this.isOnCooldown = false;
    }, this.config.cooldownMs);
  }

  getLastKeypoints(): poseDetection.Keypoint[] {
    return this.lastKeypoints;
  }

  dispose() {
    if (this.detector) {
      this.detector.dispose();
      this.detector = null;
    }
  }
}
