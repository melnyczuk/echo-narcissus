import { console, process } from 'globalthis/implementation';
import moveNet, { DrawOptions } from '../services/moveNet';
import { MsgType, poseMsg, Settings, settingsMsg } from './messages';

const { WEBSOCKETS_HOST: HOST = '127.0.0.1', WEBSOCKETS_PORT: PORT = 4242 } =
  process.env;

const serverSettings: Settings = {
  model_dir: 'data',
};

const streamCfg: MediaStreamConstraints = {
  video: {
    width: { max: 3840, ideal: 1280, min: 1280 },
    height: { max: 2160, ideal: 720, min: 720 },
    frameRate: { max: 30, ideal: 30, min: 25 },
  },
};

const drawOptions: DrawOptions = {
  frame: true,
  labels: true,
  points: true,
};

const socket = new WebSocket(`ws://${HOST}:${PORT}`);

socket.onopen = async (event) => {
  console.log(`Socket open <= ${event.type}`);

  const video = document.getElementById('webcam') as HTMLVideoElement;
  const detector = await moveNet.createDetector();
  const drawGeneratedPose = moveNet.draw(video, 'green', drawOptions);
  const drawLivePose = moveNet.draw(video, 'red', drawOptions);

  socket.send(settingsMsg(serverSettings));

  video.srcObject = await navigator.mediaDevices.getUserMedia(streamCfg);
  video.onloadeddata = async function loop() {
    const [pose] = await detector.estimatePoses(video);
    drawLivePose(pose);
    const normalisedPose = moveNet.normalise(video, pose);
    socket.send(poseMsg(normalisedPose));
    window.requestAnimationFrame(loop);
  };

  socket.onclose = (event) => console.log(`Socket closed <= ${event.code}`);
  socket.onerror = (error) => console.error(`Socket error <= ${error}`);
  socket.onmessage = (event) => {
    console.log(`Socket message <= ${event.type}`);

    const { data, type } = JSON.parse(event.data);

    if (type === MsgType.POSE) {
      const upscaledPose = moveNet.upscale(video, data);
      window.requestAnimationFrame(() => drawGeneratedPose(upscaledPose));
      return;
    }

    if (type === MsgType.ERROR) {
      console.error(data);
      return;
    }

    if (type === MsgType.IMAGE) {
      return;
    }

    if (type === MsgType.SETTINGS) {
      return;
    }

    if (type === MsgType.OK) {
      return;
    }
  };
};
