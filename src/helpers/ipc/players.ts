// Renderer: IPC helpers for players CRUD
import type { Player } from '../../types/players';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
      };
    };
  }
}

export const getAllPlayers = (): Promise<Player[]> =>
  window.electron.ipcRenderer.invoke('players:getAll');
export const createPlayer = (data: Omit<Player, 'id'>): Promise<Player> =>
  window.electron.ipcRenderer.invoke('players:create', data);
export const updatePlayer = (
  data: Partial<Player> & { id: number }
): Promise<Player> =>
  window.electron.ipcRenderer.invoke('players:update', data);
export const deletePlayer = (id: number): Promise<Player> =>
  window.electron.ipcRenderer.invoke('players:delete', id);
