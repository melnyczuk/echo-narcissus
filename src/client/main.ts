import { app, BrowserWindow } from 'electron';
import process from 'process';
import childProcess from 'child_process';

const server = childProcess.spawn('pipenv', ['run', 'server']);

function createWindow() {
  const win = new BrowserWindow({
    width: 1080,
    height: 1280,
    title: 'wool-gather',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: './preload.ts',
    },
  });

  win.loadFile('./public/index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

process.on('exit', () => server.kill());
