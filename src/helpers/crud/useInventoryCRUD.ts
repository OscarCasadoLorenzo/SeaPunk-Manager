import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Inventory } from '../../types/inventory';
import {
  getAllInventory,
  createInventory as ipcCreateInventory,
  deleteInventory as ipcDeleteInventory,
  updateInventory as ipcUpdateInventory,
} from '../ipc/inventory';

const fetchInventory = async (): Promise<Inventory[]> => getAllInventory();
const getInventoryById = async (id: number): Promise<Inventory | undefined> => {
  const all = await getAllInventory();
  return all.find((item) => item.id === id);
};
const createInventory = async (
  data: Omit<Inventory, 'id'>
): Promise<Inventory> => ipcCreateInventory(data);
const updateInventory = async (
  data: Partial<Inventory> & { id: number }
): Promise<Inventory> => ipcUpdateInventory(data);
const deleteInventory = async (id: number): Promise<Inventory> =>
  ipcDeleteInventory(id);

export function useInventory() {
  return useQuery({ queryKey: ['inventory'], queryFn: fetchInventory });
}
export function useInventoryItem(id: number) {
  return useQuery({
    queryKey: ['inventory', id],
    queryFn: () => getInventoryById(id),
    enabled: !!id,
  });
}
export function useCreateInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createInventory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
  });
}
export function useUpdateInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateInventory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
  });
}
export function useDeleteInventory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteInventory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['inventory'] }),
  });
}
