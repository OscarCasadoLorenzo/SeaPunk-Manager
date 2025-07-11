import {
  CreateInventoryRequest,
  Inventory,
  UpdateInventoryRequest,
} from '@/types';
import { api } from './api';

export const inventoryService = {
  async getInventoriesByCharacterId(characterId: string): Promise<Inventory[]> {
    const response = await api.get<Inventory[]>(
      `/inventories/character/${characterId}`
    );
    return response.data;
  },

  async getInventoryById(id: string): Promise<Inventory> {
    const response = await api.get<Inventory>(`/inventories/${id}`);
    return response.data;
  },

  async createInventory(
    inventoryData: CreateInventoryRequest
  ): Promise<Inventory> {
    const response = await api.post<Inventory>('/inventories', inventoryData);
    return response.data;
  },

  async updateInventory(
    id: string,
    inventoryData: UpdateInventoryRequest
  ): Promise<Inventory> {
    const response = await api.put<Inventory>(
      `/inventories/${id}`,
      inventoryData
    );
    return response.data;
  },

  async deleteInventory(id: string): Promise<void> {
    await api.delete(`/inventories/${id}`);
  },

  async getInventoriesByType(
    characterId: string,
    type: string
  ): Promise<Inventory[]> {
    const response = await api.get<Inventory[]>(
      `/inventories/character/${characterId}/type/${type}`
    );
    return response.data;
  },
};
