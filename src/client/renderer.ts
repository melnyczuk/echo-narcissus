import {
  console,
  document,
  HTMLCanvasElement,
  HTMLVideoElement,
  MediaStream,
  window,
} from 'globalthis/implementation';
import moveNet from '../services/moveNet';
import { MsgType, poseMsg, Settings, settingsMsg } from './messages';

const BASE_URL = '127.0.0.1:4242';

const socket = new WebSocket(`ws://${BASE_URL}`);

const settings: Settings = {
  host: '127.0.0.1',
  port: 4242,
  model_dir: 'data',
};

const streamContraints: MediaStreamConstraints = {
  video: {
    width: { max: 3840, ideal: 1280, min: 1280 },
    height: { max: 2160, ideal: 720, min: 720 },
    frameRate: { max: 30, ideal: 30, min: 25 },
  },
};

const canvas = document.getElementById('display') as HTMLCanvasElement;
const fpsElement = document.getElementById('fps');

const drawLivePose = moveNet.draw('red', {points:true, frame:true});
const drawGeneratedPose = moveNet.draw('green');

const renderFPS =
  (then: number): FrameRequestCallback =>
  (now: number) => {
    const elapsedTime = now - then;
    const fps = (1 / elapsedTime) * 1000;
    fpsElement.innerText = `${Math.floor(fps)} fps`;
    window.requestAnimationFrame(renderFPS(now));
  };

const bindVideoToMoveNet = async (videoElm: HTMLVideoElement) => {
  const moveNetDetector = await moveNet.createDetector();

  const loop = async () => {
    const [pose] = await moveNetDetector.estimatePoses(videoElm);
    drawLivePose(canvas, pose);
    const normalisedPose = moveNet.normalise(canvas, pose);
    socket.send(poseMsg(normalisedPose));
    window.requestAnimationFrame(loop);
  };

  return loop;
};

const handleStream = async (stream: MediaStream): Promise<void> => {
  const videoElm = document.getElementById('webcam') as HTMLVideoElement;
  videoElm.srcObject = stream;
  videoElm.onloadeddata = await bindVideoToMoveNet(videoElm);
};

socket.onopen = (event): void => {
  console.log(`Socket open <= ${event.type}`);
  socket.send(settingsMsg(settings));
  navigator.mediaDevices
    .getUserMedia(streamContraints)
    .then(handleStream)
    .catch(console.error);
  window.requestAnimationFrame(renderFPS(Date.now() / 1000));
};

socket.onclose = (event): void => {
  console.log(`Socket closed <= ${event.code}`);
};

socket.onerror = (): void => console.error('Socket error <=');

socket.onmessage = async (event) => {
  const { data, type } = JSON.parse(event.data);
  console.log(`${type} <=`, data);

  if (type === MsgType.POSE) {
    drawGeneratedPose(canvas, data);
  }
};
