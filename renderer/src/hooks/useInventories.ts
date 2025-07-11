import { inventoryService } from '@/services/inventories';
import { CreateInventoryRequest, UpdateInventoryRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useInventories = (characterId: string) => {
  return useQuery({
    queryKey: ['inventories', 'character', characterId],
    queryFn: () => inventoryService.getInventoriesByCharacterId(characterId),
    enabled: !!characterId,
  });
};

export const useInventory = (id: string) => {
  return useQuery({
    queryKey: ['inventories', id],
    queryFn: () => inventoryService.getInventoryById(id),
    enabled: !!id,
  });
};

export const useInventoriesByType = (characterId: string, type: string) => {
  return useQuery({
    queryKey: ['inventories', 'character', characterId, 'type', type],
    queryFn: () => inventoryService.getInventoriesByType(characterId, type),
    enabled: !!characterId && !!type,
  });
};

export const useCreateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInventoryRequest) =>
      inventoryService.createInventory(data),
    onSuccess: (newInventory) => {
      queryClient.invalidateQueries({
        queryKey: ['inventories', 'character', newInventory.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['characters', newInventory.characterId],
      });
    },
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateInventoryRequest }) =>
      inventoryService.updateInventory(id, data),
    onSuccess: (updatedInventory, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['inventories', id] });
      queryClient.invalidateQueries({
        queryKey: ['inventories', 'character', updatedInventory.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['characters', updatedInventory.characterId],
      });
    },
  });
};

export const useDeleteInventory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => inventoryService.deleteInventory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventories'] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};
