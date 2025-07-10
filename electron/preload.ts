import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';

// Define the API interface
interface ElectronAPI {
  getAppVersion: () => Promise<string>;
  getPlatform: () => Promise<string>;
  // Add more API methods as needed
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI: ElectronAPI = {
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  getPlatform: () => ipcRenderer.invoke('platform'),
};

// Use contextBridge to expose the API
contextBridge.exposeInMainWorld('electronAPI', electronAPI);

// Also expose a limited version of ipcRenderer for custom events
contextBridge.exposeInMainWorld('ipcRenderer', {
  send: (channel: string, ...args: any[]) => {
    // Whitelist channels
    const validChannels = ['message-to-main'];
    if (validChannels.includes(channel)) {
      ipcRenderer.send(channel, ...args);
    }
  },
  receive: (channel: string, func: (...args: any[]) => void) => {
    // Whitelist channels
    const validChannels = ['message-from-main'];
    if (validChannels.includes(channel)) {
      ipcRenderer.on(channel, (event: IpcRendererEvent, ...args: any[]) =>
        func(...args)
      );
    }
  },
});

// Type declarations for the global objects
declare global {
  interface Window {
    electronAPI: ElectronAPI;
    ipcRenderer: {
      send: (channel: string, ...args: any[]) => void;
      receive: (channel: string, func: (...args: any[]) => void) => void;
    };
  }
}
