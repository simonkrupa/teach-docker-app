// Disable no-unused-vars, broken for spread args
/* eslint no-unused-vars: off */
import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

export type Channels =
  | 'ipc-example'
  | 'app-exit'
  | 'app-minimize'
  | 'container-data'
  | 'stop-listening'
  | 'start-listening-1'
  | 'network-data'
  | 'start-listening-2'
  | 'start-listening-3'
  | 'start-listening-4'
  | 'start-listening-5'
  | 'host-ip-address'
  | 'node-vm-data'
  | 'start-listening-6'
  | 'start-listening-7'
  | 'validate-primary-ip'
  | 'validate-secondary-ip'
  | 'lan-data'
  | 'set-docker-vms'
  | 'get-user-progress'
  | 'set-user-progress';

const electronHandler = {
  ipcRenderer: {
    sendMessage(channel: Channels, ...args: unknown[]) {
      ipcRenderer.send(channel, ...args);
    },
    on(channel: Channels, func: (...args: unknown[]) => void) {
      const subscription = (_event: IpcRendererEvent, ...args: unknown[]) =>
        func(...args);
      ipcRenderer.on(channel, subscription);

      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel: Channels, func: (...args: unknown[]) => void) {
      ipcRenderer.once(channel, (_event, ...args) => func(...args));
    },
  },
};

contextBridge.exposeInMainWorld('electron', electronHandler);

export type ElectronHandler = typeof electronHandler;
