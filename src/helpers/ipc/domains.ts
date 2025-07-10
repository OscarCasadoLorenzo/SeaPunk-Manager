// Renderer: IPC helpers for domains CRUD
import type { Domains } from '../../types/domains';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
      };
    };
  }
}

export const getAllDomains = (): Promise<Domains[]> =>
  window.electron.ipcRenderer.invoke('domains:getAll');
export const createDomains = (data: Domains): Promise<Domains> =>
  window.electron.ipcRenderer.invoke('domains:create', data);
export const updateDomains = (
  data: Partial<Domains> & { characterId: number }
): Promise<Domains> =>
  window.electron.ipcRenderer.invoke('domains:update', data);
export const deleteDomains = (characterId: number): Promise<Domains> =>
  window.electron.ipcRenderer.invoke('domains:delete', characterId);
