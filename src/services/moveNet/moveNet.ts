import {
  createDetector as cD,
  Keypoint,
  movenet,
  Pose,
  PoseDetector,
  SupportedModels,
} from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import { drawFrame, drawLabels, DrawOptions, drawPoints } from './drawMethods';

/**
 *
 * https://tfhub.dev/google/tfjs-model/movenet/singlepose/lightning/3:
 * Input:
 * - A frame of video or an image, represented as an int32 tensor of shape: 192x192x3. Channels order: RGB with values in [0, 255].
 * Output:
 * - A float32 tensor of shape [1, 1, 17, 3].
 * - - The first two channels of the last dimension represents the yx coordinates (normalized to image frame, i.e. range in [0.0, 1.0]) of the 17 keypoints (in the order of: [nose, left eye, right eye, left ear, right ear, left shoulder, right shoulder, left elbow, right elbow, left wrist, right wrist, left hip, right hip, left knee, right knee, left ankle, right ankle]).
 * - - The third channel of the last dimension represents the prediction confidence scores of each keypoint, also in the range [0.0, 1.0].
 * Intended uses:
 * - Optimized to be run in the browser environment using Tensorflow.js with WebGL support or on-device with TF Lite.
 * - Tuned to be robust on detecting fitness/fast movement with difficult poses and/or motion blur.
 * - Most suitable for detecting the pose of a single person who is 3ft ~ 6ft away from a device’s webcam that captures the video stream.
 * - Focus on detecting the pose of the person who is closest to the image center and ignore the other people who are in the image frame (i.e. background people rejection).
 * - The model predicts 17 human keypoints of the full body even when they are occluded. For the keypoints which are outside of the image frame, the model will emit low confidence scores. A confidence threshold (recommended default: 0.3) can be used to filter out unconfident predictions.
 *
 */

interface MoveNetCreateDetectorMethod {
  (): Promise<PoseDetector>;
}

interface MoveNetRescaleMethod {
  (video: HTMLVideoElement, pose: Pose): Pose;
}

interface DrawMethod {
  (video: HTMLVideoElement, color: string, options: DrawOptions): (
    p: Pose
  ) => void;
}

export const createDetector: MoveNetCreateDetectorMethod = () =>
  cD(SupportedModels.MoveNet, {
    modelType: movenet.modelType.SINGLEPOSE_LIGHTNING,
  });

export const draw: DrawMethod = (
  video,
  color,
  { labels, points, frame } = {}
) => {
  const canvas = document.createElement('canvas');
  canvas.className = 'display';
  canvas.width = video.width;
  canvas.height = video.height;
  document.body.appendChild(canvas);

  const context = canvas.getContext('2d');
  context.strokeStyle = color;

  return (pose) => {
    context.clearRect(0, 0, video.width, video.height);
    frame && drawFrame(context, pose.keypoints);
    labels && drawLabels(context, pose.keypoints);
    points && drawPoints(context, pose.keypoints);
  };
};

export const normalise: MoveNetRescaleMethod = (video, pose) => {
  const { width, height } = video;
  const keypoints: Keypoint[] = pose.keypoints.map(({ x, y, ...rest }) => ({
    ...rest,
    x: x / width,
    y: y / height,
  }));
  return { ...pose, keypoints };
};

export const upscale: MoveNetRescaleMethod = (video, pose) => {
  const { width, height } = video;
  const keypoints: Keypoint[] = pose.keypoints.map(({ x, y, ...rest }) => ({
    ...rest,
    x: x * width,
    y: y * height,
  }));
  return { ...pose, keypoints };
};
