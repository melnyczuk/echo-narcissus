import { Object, window } from 'globalthis/implementation';
import WebSocket from 'ws';

window.addEventListener('DOMContentLoaded', () => {
  Object.defineProperty(window, 'WebSocket', WebSocket);
});
