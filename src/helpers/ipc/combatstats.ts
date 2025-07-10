// Renderer: IPC helpers for combatstats CRUD
import type { CombatStats } from '../../types/combatstats';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
      };
    };
  }
}

export const getAllCombatStats = (): Promise<CombatStats[]> =>
  window.electron.ipcRenderer.invoke('combatstats:getAll');
export const createCombatStats = (data: CombatStats): Promise<CombatStats> =>
  window.electron.ipcRenderer.invoke('combatstats:create', data);
export const updateCombatStats = (
  data: Partial<CombatStats> & { characterId: number }
): Promise<CombatStats> =>
  window.electron.ipcRenderer.invoke('combatstats:update', data);
export const deleteCombatStats = (characterId: number): Promise<CombatStats> =>
  window.electron.ipcRenderer.invoke('combatstats:delete', characterId);
