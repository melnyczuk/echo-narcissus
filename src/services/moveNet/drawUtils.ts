import { Keypoint } from '@tensorflow-models/pose-detection';

interface DrawMethod {
  (context: CanvasRenderingContext2D, keypoints: Keypoint[]): void;
}

export const drawLabels: DrawMethod = (context, keypoints) =>
  keypoints.forEach(({ x, y, name }) => {
    context.beginPath();
    context.fillText(name, x, y);
    context.closePath();
  });

export const drawPoints: DrawMethod = (context, keypoints) =>
  keypoints.forEach(({ x, y }) => {
    context.beginPath();
    context.arc(x, y, 5, 0, 2 * Math.PI, false);
    context.fill();
    context.closePath();
  });

export const drawFrame: DrawMethod = (context, keypoints) => {
  const {
    right_ear,
    right_eye,
    nose,
    left_eye,
    left_ear,
    right_wrist,
    right_elbow,
    right_shoulder,
    left_shoulder,
    left_elbow,
    left_wrist,
    right_ankle,
    right_knee,
    right_hip,
    left_hip,
    left_knee,
    left_ankle,
  }: Record<string, [number, number]> = keypoints.reduce(
    (acc, { x, y, name }) => ({ ...acc, [name]: [x, y] }),
    {}
  );

  context.beginPath();
  // face
  context.moveTo(...right_ear);
  context.lineTo(...right_eye);
  context.lineTo(...nose);
  context.lineTo(...left_eye);
  context.lineTo(...left_ear);
  // arms
  context.moveTo(...right_wrist);
  context.lineTo(...right_elbow);
  context.lineTo(...right_shoulder);
  context.lineTo(...left_shoulder);
  context.lineTo(...left_elbow);
  context.lineTo(...left_wrist);
  // legs
  context.moveTo(...right_ankle);
  context.lineTo(...right_knee);
  context.lineTo(...right_hip);
  context.lineTo(...left_hip);
  context.lineTo(...left_knee);
  context.lineTo(...left_ankle);

  context.stroke();
  context.closePath();
};
