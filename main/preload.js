const { contextBridge, ipcRenderer } = require('electron');

// Preload script for Electron (optional, can be extended for IPC)
window.addEventListener('DOMContentLoaded', () => {
  // You can expose APIs to the renderer here
  contextBridge.exposeInMainWorld('themeMode', {
    current: () => ipcRenderer.invoke('theme-mode:current'),
    toggle: () => ipcRenderer.invoke('theme-mode:toggle'),
    dark: () => ipcRenderer.invoke('theme-mode:dark'),
    light: () => ipcRenderer.invoke('theme-mode:light'),
    system: () => ipcRenderer.invoke('theme-mode:system'),
  });

  contextBridge.exposeInMainWorld('electronWindow', {
    minimize: () => ipcRenderer.invoke('win:minimize'),
    maximize: () => ipcRenderer.invoke('win:maximize'),
    close: () => ipcRenderer.invoke('win:close'),
  });
});
