// Expose ipcRenderer to the renderer process via contextBridge
export function exposeIpcContext() {
  const { contextBridge, ipcRenderer } = window.require('electron');
  contextBridge.exposeInMainWorld('electron', {
    ipcRenderer,
  });
}
