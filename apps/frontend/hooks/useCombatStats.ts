import { useApiMutation, useApiQuery } from '@/hooks/use-api-query';
import { fetchApi } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCombatStats = (characterId: string) => {
  return useApiQuery(`/combat-stats/character/${characterId}`, {
    enabled: !!characterId,
  });
};

export const useCreateCombatStats = () => {
  const queryClient = useQueryClient();

  return useApiMutation('/combat-stats', 'post', {
    onSuccess: (newCombatStats: any) => {
      queryClient.invalidateQueries({
        queryKey: ['/combat-stats/character', newCombatStats.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['/characters', newCombatStats.characterId],
      });
    },
  });
};

export const useUpdateCombatStats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return fetchApi(`/combat-stats/${id}`, {
        method: 'PATCH',
        body: data,
      });
    },
    onSuccess: (updatedCombatStats: any) => {
      queryClient.invalidateQueries({
        queryKey: [`/combat-stats/character/${updatedCombatStats.characterId}`],
      });
      queryClient.invalidateQueries({
        queryKey: [`/characters/${updatedCombatStats.characterId}`],
      });
    },
  });
};

export const useDeleteCombatStats = () => {
  const queryClient = useQueryClient();

  return useApiMutation('/combat-stats', 'delete', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/combat-stats'] });
      queryClient.invalidateQueries({ queryKey: ['/characters'] });
    },
  });
};

export const useUpsertCombatStats = () => {
  const queryClient = useQueryClient();

  return useApiMutation('/combat-stats/upsert', 'post', {
    onSuccess: (combatStats: any) => {
      queryClient.invalidateQueries({
        queryKey: ['/combat-stats/character', combatStats.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['/characters', combatStats.characterId],
      });
    },
  });
};
