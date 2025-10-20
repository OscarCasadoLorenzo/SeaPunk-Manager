import { useApiQuery, useApiMutation } from '@/hooks/use-api-query';
import { CreateInventoryRequest, UpdateInventoryRequest } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

export const useInventories = (characterId: string) => {
  return useApiQuery(
    `/inventories/character/${characterId}`,
    {
      enabled: !!characterId,
    }
  );
};

export const useInventory = (id: string) => {
  return useApiQuery(
    `/inventories/${id}`,
    {
      enabled: !!id,
    }
  );
};

export const useInventoriesByType = (characterId: string, type: string) => {
  return useApiQuery(
    `/inventories/character/${characterId}/type/${type}`,
    {
      enabled: !!characterId && !!type,
    }
  );

export const useCreateInventory = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, CreateInventoryRequest>(
    '/inventories',
    'post',
    {
      onSuccess: (newInventory) => {
        queryClient.invalidateQueries({
          queryKey: ['/inventories/character', newInventory.characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', newInventory.characterId],
        });
      },
    }
  );
};

export const useUpdateInventory = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, { id: string; data: UpdateInventoryRequest }>(
    '/inventories',
    'put',
    {
      onSuccess: (updatedInventory, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['/inventories', id] });
        queryClient.invalidateQueries({
          queryKey: ['/inventories/character', updatedInventory.characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', updatedInventory.characterId],
        });
      },
    }
  );
};

export const useDeleteInventory = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, string>(
    '/inventories',
    'delete',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/inventories'] });
        queryClient.invalidateQueries({ queryKey: ['/characters'] });
      },
    }
  );
};
