// Renderer: IPC helpers for attributes CRUD
import type { Attribute } from '../../types/attributes';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
      };
    };
  }
}

export const getAllAttributes = (): Promise<Attribute[]> =>
  window.electron.ipcRenderer.invoke('attributes:getAll');
export const createAttribute = (
  data: Omit<Attribute, 'characterId'> & { characterId: number }
): Promise<Attribute> =>
  window.electron.ipcRenderer.invoke('attributes:create', data);
export const updateAttribute = (
  data: Partial<Attribute> & { characterId: number }
): Promise<Attribute> =>
  window.electron.ipcRenderer.invoke('attributes:update', data);
export const deleteAttribute = (characterId: number): Promise<Attribute> =>
  window.electron.ipcRenderer.invoke('attributes:delete', characterId);
