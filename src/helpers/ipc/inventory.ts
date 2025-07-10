// Renderer: IPC helpers for inventory CRUD
import type { Inventory } from '../../types/inventory';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        invoke: (channel: string, ...args: any[]) => Promise<any>;
      };
    };
  }
}

export const getAllInventory = (): Promise<Inventory[]> =>
  window.electron.ipcRenderer.invoke('inventory:getAll');
export const createInventory = (
  data: Omit<Inventory, 'id'>
): Promise<Inventory> =>
  window.electron.ipcRenderer.invoke('inventory:create', data);
export const updateInventory = (
  data: Partial<Inventory> & { id: number }
): Promise<Inventory> =>
  window.electron.ipcRenderer.invoke('inventory:update', data);
export const deleteInventory = (id: number): Promise<Inventory> =>
  window.electron.ipcRenderer.invoke('inventory:delete', id);
