// Renderer: IPC helpers for auragifts CRUD
import type { AuraGift } from '../../types/auragift';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
      };
    };
  }
}

export const getAllAuraGifts = (): Promise<AuraGift[]> =>
  window.electron.ipcRenderer.invoke('auragifts:getAll');
export const createAuraGift = (data: AuraGift): Promise<AuraGift> =>
  window.electron.ipcRenderer.invoke('auragifts:create', data);
export const updateAuraGift = (
  data: Partial<AuraGift> & { characterId: number }
): Promise<AuraGift> =>
  window.electron.ipcRenderer.invoke('auragifts:update', data);
export const deleteAuraGift = (characterId: number): Promise<AuraGift> =>
  window.electron.ipcRenderer.invoke('auragifts:delete', characterId);
