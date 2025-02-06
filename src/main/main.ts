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
import platformNetworkInterfacesMap from './utils/platformUtils';
import SshConnector from './listeners/sshConnector';

const Docker = require('dockerode');
const {
  getExistingUserOrCreate,
  increaseUserProgress,
} = require('./utils/userProgress');

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

// TODO
const config: SshConfig = {
  host: '',
  port: 22,
  username: 'simon',
  password: 'simon',
};

let mainWindow: BrowserWindow | null = null;
let dockerEventListener: DockerEventListener | null = null;
let dockerEventListenerOverlay: DockerEventListener | null = null;
let hostIpAddress: string | null = null;

ipcMain.on('get-user-progress', (event, arg) => {
  const username = arg[0];
  const progress = getExistingUserOrCreate(username);
  if (progress === undefined) {
    console.log('User does not exist:', username);
    event.reply('get-user-progress', undefined);
  }
  event.reply('get-user-progress', [username, progress]);
});

ipcMain.on('write-user-progress', (event, arg) => {
  increaseUserProgress(arg[0]);
});

function setDockerEventListener(mainWindow: BrowserWindow, ipAddress: string) {
  config.host = ipAddress;
  dockerEventListener = new DockerEventListener(
    mainWindow,
    ipAddress,
    new SshConnector(config),
  );
  hostIpAddress = ipAddress;
  return dockerEventListener;
}

function setDockerEventListenerOverlay(
  mainWindow: BrowserWindow,
  ipAddress: string,
) {
  dockerEventListenerOverlay = new DockerEventListener(
    mainWindow,
    ipAddress,
    new SshConnector({}),
  );
  return dockerEventListenerOverlay;
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

  const platform = os.platform();
  const keyBasedOnPlatform = platformNetworkInterfacesMap.get(platform);
  if (keyBasedOnPlatform) {
    const tempInterfaces = Object.values(filteredInterfaces).filter((item) =>
      item.key.toLowerCase().startsWith(keyBasedOnPlatform),
    );
    if (tempInterfaces.length === 0 && platform === 'win32') {
      Object.values(filteredInterfaces).find((item) => {
        if (item.key.toLowerCase().startsWith('eth')) {
          tempInterfaces.push(item);
        }
      });
    }
    return tempInterfaces.length > 0 ? tempInterfaces[0] : null;
  }
  return null;
}

function sendHostIpAddress(hostIpAddress: string) {
  mainWindow?.webContents.send('host-ip-address', hostIpAddress);
}

function sendLan() {
  const lanData = getNetworkInterfaces();
  if (lanData) {
    mainWindow?.webContents.send('lan-data', JSON.stringify(lanData));
  }
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
    icon: getAssetPath('block.png'),
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

  ipcMain.on('stop-listening', () => {
    // TODO stop listening to events on second listener overlay and ssh
    dockerEventListener?.disconnectSsh();
    dockerEventListener?.stopListeningToEvents();
  });

  async function validateDockerAPI(ipAddress) {
    // Initialize Dockerode with the provided IP address
    const docker = new Docker({
      host: ipAddress,
      port: 2375, // Default Docker API port for HTTP
      timeout: 2000, // Set a timeout to avoid long waits
    });

    try {
      // Attempt to get Docker version info
      await docker.version();
      console.log('Docker API is reachable at this IP address.');
      return true;
    } catch (error) {
      console.error('Failed to reach Docker API:', error.message);
      return false;
    }
  }

  ipcMain.on('validate-primary-ip', async (event, arg) => {
    console.log('Validating primary IP address:', arg[0]);
    const isValid = await validateDockerAPI(arg[0]);
    event.reply('validate-primary-ip', [isValid]);
  });

  ipcMain.on('validate-secondary-ip', async (event, arg) => {
    const isValid = await validateDockerAPI(arg[0]);
    event.reply('validate-secondary-ip', [isValid]);
  });

  ipcMain.on('set-docker-vms', async (event, arg) => {
    const primaryIpValue = arg[0];
    const secondaryIpValue = arg[1];
    setDockerEventListener(mainWindow, primaryIpValue);
    setDockerEventListenerOverlay(mainWindow, secondaryIpValue);
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
    dockerEventListenerOverlay?.listenToEventsSecondary(
      containerToListenOverlay,
    );
    const emptySet = new Set<string>();
    dockerEventListenerOverlay?.getCurrentStateOfContainers(
      containerToListenOverlay,
      emptySet,
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
    sendLan();
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
    sendHostIpAddress(hostIpAddress);
    sendLan();
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
