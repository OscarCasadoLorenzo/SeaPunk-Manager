// Renderer: IPC helpers for effect CRUD
import type { Effect } from '../../types/effect';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
      };
    };
  }
}

export const getAllEffects = (): Promise<Effect[]> =>
  window.electron.ipcRenderer.invoke('effect:getAll');
export const createEffect = (data: Omit<Effect, 'id'>): Promise<Effect> =>
  window.electron.ipcRenderer.invoke('effect:create', data);
export const updateEffect = (
  data: Partial<Effect> & { id: number }
): Promise<Effect> => window.electron.ipcRenderer.invoke('effect:update', data);
export const deleteEffect = (id: number): Promise<Effect> =>
  window.electron.ipcRenderer.invoke('effect:delete', id);
