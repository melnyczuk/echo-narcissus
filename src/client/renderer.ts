import console from 'console';
import { Settings, settingsMsg } from './websockets';

const BASE_URL = '127.0.0.1:4242';

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

const socket = new WebSocket(`ws://${BASE_URL}`);

socket.onopen = (event): void => {
  console.log(`Socket open <= ${event.type}`);
  socket.send(settingsMsg(settings));
  navigator.mediaDevices
    .getUserMedia(streamContraints)
    .then((stream): void => {
      const videoElm = document.getElementById('webcam') as HTMLVideoElement;
      videoElm.srcObject = stream;
    })
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
