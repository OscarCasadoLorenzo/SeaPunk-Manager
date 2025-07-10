// Renderer: IPC helpers for essence CRUD
import type { Essence } from '../../types/essence';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
      };
    };
  }
}

export const getAllEssence = (): Promise<Essence[]> =>
  window.electron.ipcRenderer.invoke('essence:getAll');
export const createEssence = (data: Essence): Promise<Essence> =>
  window.electron.ipcRenderer.invoke('essence:create', data);
export const updateEssence = (
  data: Partial<Essence> & { characterId: number }
): Promise<Essence> =>
  window.electron.ipcRenderer.invoke('essence:update', data);
export const deleteEssence = (characterId: number): Promise<Essence> =>
  window.electron.ipcRenderer.invoke('essence:delete', characterId);
