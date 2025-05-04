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
import * as pty from 'node-pty';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Docker from 'dockerode';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';
import DockerEventListener from './listeners/dockerEventListener';
import platformNetworkInterfacesMap from './utils/platformUtils';
import SshConnector from './listeners/sshConnector';

import {
  getExistingUserOrCreate,
  increaseUserProgress,
  createFileIfNotExists,
} from './utils/userProgress';

// templates for each diagram page
import diagram1 from './data/diagram1.json';
import diagram2 from './data/diagram2.json';
import diagram3 from './data/diagram3.json';
import diagram4 from './data/diagram4.json';
import diagram5 from './data/diagram5.json';
import diagram5n1 from './data/diagram5n1.json';
import diagram6 from './data/diagram6.json';
import diagram7 from './data/diagram7.json';

const osShell = os.platform() === 'win32' ? 'powershell.exe' : 'bash';

const ptyProcesses = new Map<number, pty.IPty>();
const ptyProcessesData = new Map<number, any>();
let processCounter = 0;

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

const config: SshConfig = {
  host: '',
  port: 22,
  username: '',
  password: '',
};

const configOverlay: SshConfig = {
  host: '',
  port: 22,
  username: '',
  password: '',
};

let mainWindow: BrowserWindow | null = null;
let dockerEventListener: DockerEventListener | null = null;
let dockerEventListenerOverlay: DockerEventListener | null = null;
let sshConnector: SshConnector | null = null;
let sshConnectorOverlay: SshConnector | null = null;
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
  if (sshConnector === null) {
    throw new Error('SSH connector is not initialized.');
  }
  dockerEventListener = new DockerEventListener(
    mainWindow,
    ipAddress,
    sshConnector,
  );
  hostIpAddress = ipAddress;
  return dockerEventListener;
}

function setDockerEventListenerOverlay(
  mainWindow: BrowserWindow,
  ipAddress: string,
) {
  if (sshConnectorOverlay === null) {
    throw new Error('SSH connector is not initialized.');
  }
  dockerEventListenerOverlay = new DockerEventListener(
    mainWindow,
    ipAddress,
    sshConnectorOverlay,
  );
  return dockerEventListenerOverlay;
}

function getNetworkInterfaces() {
  const interfaces = os.networkInterfaces();
  const filteredInterfaces = Object.keys(interfaces)
    .filter((key) => !key.toLowerCase().startsWith('lo'))
    .flatMap((key) =>
      interfaces[key]
        .filter((address) => address.family === 'IPv4')
        .map((address) => ({ key, ...address })),
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

function getHostNetworkInterface(requestedIpAddr: string) {
  dockerEventListener?.getHostNetworkInterface(requestedIpAddr);
}

function sendHostIpAddress(hostIpAddress: string) {
  getHostNetworkInterface(hostIpAddress);
  mainWindow?.webContents.send('host-ip-address', { ip: hostIpAddress });
}

function sendLan() {
  const lanData = getNetworkInterfaces();
  if (lanData) {
    mainWindow?.webContents.send('lan-data', JSON.stringify(lanData));
  }
}

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug')();
}

const createWindow = async () => {
  createFileIfNotExists(app.getPath('userData'));

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

  mainWindow.on('resize', () => {
    mainWindow?.webContents.send('window-resize', 'data');
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  function createPtyProcess() {
    const ptyProcess = pty.spawn(osShell, [], {
      name: 'xterm-color',
      cols: 160,
      rows: 30,
      env: process.env,
      encoding: 'utf-8',
    });

    const processId = processCounter;
    ptyProcesses.set(processId, ptyProcess);
    ptyProcess.onData((data) => {
      mainWindow?.webContents.send(`terminal.incomingData`, [processId, data]);
      let existingData = ptyProcessesData.get(processId);
      existingData += data;
      ptyProcessesData.set(processId, existingData);
    });
    processCounter += 1;

    return processId;
  }

  ipcMain.on(`terminal.keystroke`, (event, key) => {
    const ptyProcess = ptyProcesses.get(key[0]);
    if (ptyProcess) {
      ptyProcess.write(key[1]);
    }
  });

  ipcMain.on(`terminal-restore-data`, (event, key) => {
    const ptyData = ptyProcessesData.get(key[0]);
    if (ptyData) {
      mainWindow?.webContents.send(`terminal.incomingData`, [key[0], ptyData]);
    }
  });

  ipcMain.on('create-terminal', () => {
    createPtyProcess();
  });

  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  new AppUpdater();
  // Start listening to events

  ipcMain.on('stop-listening', () => {
    dockerEventListener?.stopListeningToEvents();
    dockerEventListenerOverlay?.stopListeningToEvents();
  });

  function declareHostsIpAddresses(ip1: string, ip2: string) {
    mainWindow?.webContents.send('set-nodes-ip', { ip1, ip2 });
  }

  async function validateSshConnection(ipAddress) {
    config.host = ipAddress;
    if (sshConnector !== null) {
      sshConnector.disconnect();
    }
    sshConnector = new SshConnector(config);
    await sshConnector.waitForConnection();
    return sshConnector.isConnectedStatus();
  }

  async function validateSshConnectionOverlay(ipAddress) {
    configOverlay.host = ipAddress;
    if (sshConnectorOverlay !== null) {
      sshConnectorOverlay.disconnect();
    }
    sshConnectorOverlay = new SshConnector(configOverlay);
    await sshConnectorOverlay.waitForConnection();
    return sshConnectorOverlay.isConnectedStatus();
  }

  async function validateDockerAPI(ipAddress) {
    // Initialize Dockerode with the provided IP address
    const docker = new Docker({
      host: ipAddress,
      port: 2375, // Default Docker API port for HTTP
      timeout: 2000, // Set a timeout to avoid long waits
    });

    try {
      await docker.version();
      console.log('Docker API is reachable at this IP address.');
      return true;
    } catch (error) {
      console.error('Failed to reach Docker API:', error.message);
      return false;
    }
  }

  ipcMain.on('validate-primary-ip', async (event, arg) => {
    const isValid = await validateDockerAPI(arg[0]);
    [config.username, config.password] = [arg[1], arg[2]];
    if (isValid) {
      const isSshAccessible = await validateSshConnection(arg[0]);
      if (isSshAccessible) {
        event.reply('validate-primary-ip', [true]);
        return;
      }
    }
    event.reply('validate-primary-ip', [false]);
  });

  ipcMain.on('validate-secondary-ip', async (event, arg) => {
    const isValid = await validateDockerAPI(arg[0]);
    [configOverlay.username, configOverlay.password] = [arg[1], arg[2]];
    if (isValid) {
      const isSshAccessible = await validateSshConnectionOverlay(arg[0]);
      if (isSshAccessible) {
        event.reply('validate-secondary-ip', [true]);
        return;
      }
    }
    event.reply('validate-secondary-ip', [false]);
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
    declareHostsIpAddresses(config.host, configOverlay.host);
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
    emptySet.add('docker_gwbridge2');
    dockerEventListenerOverlay?.getCurrentStateOfContainers(
      containerToListenOverlay,
      emptySet,
    );
    uniqueNetworks.add('docker_gwbridge1');
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
    // app.setPath('userData', path.join(__dirname, 'userdata'));
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
