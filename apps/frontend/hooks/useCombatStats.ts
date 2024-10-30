import { useApiQuery, useApiMutation } from '@/hooks/use-api-query';
import { useQueryClient } from '@tanstack/react-query';

export const useCombatStats = (characterId: string) => {
  return useApiQuery(
    `/combat-stats/character/${characterId}`,
    {
      enabled: !!characterId,
    }
  );
};

export const useCreateCombatStats = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    '/combat-stats',
    'post',
    {
      onSuccess: (newCombatStats: any) => {
        queryClient.invalidateQueries({
          queryKey: ['/combat-stats/character', newCombatStats.characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', newCombatStats.characterId],
        });
      },
    }
  );

export const useUpdateCombatStats = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    '/combat-stats',
    'put',
    {
      onSuccess: (updatedCombatStats: any) => {
        queryClient.invalidateQueries({
          queryKey: ['/combat-stats/character', updatedCombatStats.characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', updatedCombatStats.characterId],
        });
      },
    }
  );
};

export const useDeleteCombatStats = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    '/combat-stats',
    'delete',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/combat-stats'] });
        queryClient.invalidateQueries({ queryKey: ['/characters'] });
      },
    }
  );
};

export const useUpsertCombatStats = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    '/combat-stats/upsert',
    'post',
    {
      onSuccess: (combatStats: any) => {
        queryClient.invalidateQueries({
          queryKey: ['/combat-stats/character', combatStats.characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', combatStats.characterId],
        });
      },
    }
  );
};
