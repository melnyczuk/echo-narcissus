import console from 'console';
import {
  HTMLVideoElement,
  MediaStream,
  window,
} from 'globalthis/implementation';
import moveNet from '../services/moveNet';
import { poseMsg, Settings, settingsMsg } from './messages';

const BASE_URL = '127.0.0.1:4242';

const socket = new WebSocket(`ws://${BASE_URL}`);

const settings: Settings = {
  host: '127.0.0.1',
  port: 4242,
  model_dir: 'data',
};

const streamContraints: MediaStreamConstraints = {
  video: {
    width: { max: 3840, ideal: 3840, min: 1280 },
    height: { max: 2160, ideal: 2160, min: 720 },
    frameRate: { max: 30, ideal: 30, min: 25 },
  },
};

const animationLoop = (videoElm: HTMLVideoElement) => () => {
  window.requestAnimationFrame(async () => {
    const [pose] = await moveNet.run(videoElm);
    socket.send(poseMsg(pose));
    animationLoop(videoElm);
  });
};

const handleStream = (stream: MediaStream): void => {
  const videoElm = document.getElementById('webcam') as HTMLVideoElement;
  videoElm.srcObject = stream;
  videoElm.onloadeddata = animationLoop(videoElm);
};

socket.onopen = (event): void => {
  console.log(`Socket open <= ${event.type}`);
  socket.send(settingsMsg(settings));
  navigator.mediaDevices
    .getUserMedia(streamContraints)
    .then(handleStream)
    .catch(console.error);
};

socket.onclose = (event): void => {
  console.log(`Socket closed <= ${event.code}`);
};

socket.onerror = (): void => console.error('Socket error <=');

socket.onmessage = async (event) => {
  const { data, type } = JSON.parse(event.data);
  console.log(`${type} <=`, data);
};
