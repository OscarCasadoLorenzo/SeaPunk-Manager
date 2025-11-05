import { useApiMutation, useApiQuery } from '@/hooks/use-api-query';
import { useQueryClient } from '@tanstack/react-query';

export const useInventories = (characterId: string) => {
  return useApiQuery(`/inventories/character/${characterId}`, {
    enabled: !!characterId,
  });
};

export const useInventory = (id: string) => {
  return useApiQuery(`/inventories/${id}`, {
    enabled: !!id,
  });
};

export const useInventoriesByType = (characterId: string, type: string) => {
  return useApiQuery(`/inventories/character/${characterId}/type/${type}`, {
    enabled: !!characterId && !!type,
  });
};

export const useCreateInventory = () => {
  const queryClient = useQueryClient();

  return useApiMutation('/inventories', 'post', {
    onSuccess: (newInventory: any) => {
      queryClient.invalidateQueries({
        queryKey: ['/inventories/character', newInventory.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['/characters', newInventory.characterId],
      });
    },
  });
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();

  return useApiMutation('/inventories', 'put', {
    onSuccess: (updatedInventory: any, { id }: any) => {
      queryClient.invalidateQueries({ queryKey: ['/inventories', id] });
      queryClient.invalidateQueries({
        queryKey: ['/inventories/character', updatedInventory.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['/characters', updatedInventory.characterId],
      });
    },
  });
};

export const useDeleteInventory = () => {
  const queryClient = useQueryClient();

  return useApiMutation('/inventories', 'delete', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/inventories'] });
      queryClient.invalidateQueries({ queryKey: ['/characters'] });
    },
  });
};
