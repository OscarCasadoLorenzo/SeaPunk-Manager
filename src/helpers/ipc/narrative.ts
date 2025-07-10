// Renderer: IPC helpers for narrative CRUD
import type { Narrative } from '../../types/narrative';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
      };
    };
  }
}

export const getAllNarrative = (): Promise<Narrative[]> =>
  window.electron.ipcRenderer.invoke('narrative:getAll');
export const createNarrative = (data: Narrative): Promise<Narrative> =>
  window.electron.ipcRenderer.invoke('narrative:create', data);
export const updateNarrative = (
  data: Partial<Narrative> & { characterId: number }
): Promise<Narrative> =>
  window.electron.ipcRenderer.invoke('narrative:update', data);
export const deleteNarrative = (characterId: number): Promise<Narrative> =>
  window.electron.ipcRenderer.invoke('narrative:delete', characterId);
