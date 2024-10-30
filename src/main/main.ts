/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import os from 'os';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import DockerEventListener from './listeners/dockerEventListener';

// templates for each diagram page
const diagram1 = require('./data/diagram1.json');
const diagram2 = require('./data/diagram2.json');
const diagram3 = require('./data/diagram3.json');
const diagram4 = require('./data/diagram4.json');
const diagram5 = require('./data/diagram5.json');
const diagram5n1 = require('./data/diagram5n1.json');
const diagram6 = require('./data/diagram6.json');
const diagram7 = require('./data/diagram7.json');

const osShell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let dockerEventListener: DockerEventListener | null = null;
let dockerEventListenerOverlay: DockerEventListener | null = null;

function getDockerEventListener(mainWindow: BrowserWindow) {
  if (!dockerEventListener) {
    dockerEventListener = new DockerEventListener(mainWindow, '192.168.56.106');
  }
  return dockerEventListener;
}

function getDockerEventListenerOverlay(mainWindow: BrowserWindow) {
  if (!dockerEventListenerOverlay) {
    dockerEventListenerOverlay = new DockerEventListener(
      mainWindow,
      '192.168.56.108',
    );
  }
  return dockerEventListenerOverlay;
}

function getHostIPAddress(): string {
  const networkInterfaces = os.networkInterfaces();
  let hostIP: string = '';

  //windows
  if (os.platform() === 'win32') {
    networkInterfaces['Wi-Fi'].forEach((network) => {
      if (network.family === 'IPv4') {
        hostIP = network.address;
      }
    });
  } else {
    networkInterfaces['en0'].forEach((network) => {
      if (network.family === 'IPv4') {
        hostIP = network.address;
      }
    });
  }
  return hostIP;
}

function getNetworkInterfaces() {
  const interfaces = os.networkInterfaces();
  const filteredInterfaces = Object.keys(interfaces)
    .filter((key) => !key.toLowerCase().startsWith('lo')) // Filter out interfaces starting with 'lo'
    .flatMap(
      (key) =>
        interfaces[key]
          .filter((address) => address.family === 'IPv4') // Filter only IPv4 addresses
          .map((address) => ({ key, ...address })), // Include the key with each address
    );

  //TODO temp change
  const tempInterfaces = Object.values(filteredInterfaces).filter(
    (item) => item.key === 'Wi-Fi',
  );
  return tempInterfaces.length > 0 ? tempInterfaces[0] : null;
}

function sendHostIpAddress(hostIpAddress: string) {
  mainWindow?.webContents.send('host-ip-address', hostIpAddress);
}

function sendLan(hostIpAddress: string) {
  // console.log(JSON.stringify(getNetworkInterfaces()));
  mainWindow?.webContents.send(
    'lan-data',
    JSON.stringify(getNetworkInterfaces()),
  );
}

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1720,
    height: 880,
    icon: getAssetPath('icon.png'),
    frame: false,
    paintWhenInitiallyHidden: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: true,
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
  // Start listening to events
  getDockerEventListener(mainWindow);
  getDockerEventListenerOverlay(mainWindow);
  // const hostIpAddress: string = getHostIPAddress();
  const hostIpAddress: string = '192.168.100.33';
  console.log('Host IP Address:', hostIpAddress);

  ipcMain.on('stop-listening', () => {
    dockerEventListener?.stopListeningToEvents();
  });

  ipcMain.on('start-listening-1', () => {
    const containerToListen = new Map<string, string>();
    const uniqueNetworks = new Set<string>();
    diagram1.containers.forEach((container) => {
      containerToListen.set(container.data.label, container.network);
      uniqueNetworks.add(container.network);
    });
    dockerEventListener?.listenToEvents(containerToListen);
    dockerEventListener?.getCurrentStateOfContainers(
      containerToListen,
      uniqueNetworks,
    );
    sendHostIpAddress(hostIpAddress);
  });
  ipcMain.on('start-listening-2', () => {
    console.log('Starting listening to events for diagram 2');
    const containerToListen = new Map<string, string>();
    const uniqueNetworks = new Set<string>();
    diagram2.containers.forEach((container) => {
      containerToListen.set(container.data.label, container.network);
      uniqueNetworks.add(container.network);
    });
    dockerEventListener?.listenToEvents(containerToListen);
    dockerEventListener?.getCurrentStateOfContainers(
      containerToListen,
      uniqueNetworks,
    );
    sendHostIpAddress(hostIpAddress);
  });
  ipcMain.on('start-listening-3', () => {
    console.log('Starting listening to events for diagram 3 ');
    const containerToListen = new Map<string, string>();
    const uniqueNetworks = new Set<string>();
    diagram3.containers.forEach((container) => {
      containerToListen.set(container.data.label, container.network);
      uniqueNetworks.add(container.network);
    });
    dockerEventListener?.listenToEvents(containerToListen);
    dockerEventListener?.getCurrentStateOfContainers(
      containerToListen,
      uniqueNetworks,
    );
    sendHostIpAddress(hostIpAddress);
  });
  ipcMain.on('start-listening-4', () => {
    console.log('Starting listening to events for diagram 4 ');
    const containerToListen = new Map<string, string>();
    const uniqueNetworks = new Set<string>();
    diagram4.containers.forEach((container) => {
      containerToListen.set(container.data.label, container.network);
      uniqueNetworks.add(container.network);
    });
    dockerEventListener?.listenToEvents(containerToListen);
    dockerEventListener?.getCurrentStateOfContainers(
      containerToListen,
      uniqueNetworks,
    );
    sendHostIpAddress(hostIpAddress);
  });
  ipcMain.on('start-listening-5', () => {
    console.log('Starting listening to events for diagram 5 ');
    const containerToListen = new Map<string, string>();
    const uniqueNetworks = new Set<string>();
    diagram5.containers.forEach((container) => {
      containerToListen.set(container.data.label, container.network);
      uniqueNetworks.add(container.network);
    });
    const containerToListenOverlay = new Map<string, string>();
    diagram5n1.containers.forEach((container) => {
      containerToListenOverlay.set(container.data.label, container.network);
      uniqueNetworks.add(container.network);
    });
    dockerEventListenerOverlay?.listenToEvents(containerToListenOverlay);
    dockerEventListenerOverlay?.getCurrentStateOfContainers(
      containerToListenOverlay,
      uniqueNetworks,
    );
    dockerEventListener?.listenToEvents(containerToListen);
    dockerEventListener?.getCurrentStateOfContainers(
      containerToListen,
      uniqueNetworks,
    );
    dockerEventListener?.getVMNodes();
    // sendHostIpAddress(hostIpAddress);
  });
  ipcMain.on('start-listening-6', () => {
    console.log('Starting listening to events for diagram 6');
    const containerToListen = new Map<string, string>();
    const uniqueNetworks = new Set<string>();
    diagram6.containers.forEach((container) => {
      containerToListen.set(container.data.label, container.network);
      uniqueNetworks.add(container.network);
    });
    dockerEventListener?.listenToEvents(containerToListen);
    dockerEventListener?.getCurrentStateOfContainers(
      containerToListen,
      uniqueNetworks,
    );
    sendHostIpAddress(hostIpAddress);
    sendLan(hostIpAddress);
  });
  ipcMain.on('start-listening-7', () => {
    console.log('Starting listening to events for diagram 7');
    const containerToListen = new Map<string, string>();
    const uniqueNetworks = new Set<string>();
    diagram7.containers.forEach((container) => {
      containerToListen.set(container.data.label, container.network);
      uniqueNetworks.add(container.network);
    });
    dockerEventListener?.listenToEvents(containerToListen);
    dockerEventListener?.getCurrentStateOfContainers(
      containerToListen,
      uniqueNetworks,
    );
    sendLan(hostIpAddress);
  });
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
      console.log('App is ready');
    });
  })
  .catch(console.log);

ipcMain.on('app-exit', () => {
  app.quit();
});

ipcMain.on('app-minimize', () => {
  mainWindow?.minimize();
});
