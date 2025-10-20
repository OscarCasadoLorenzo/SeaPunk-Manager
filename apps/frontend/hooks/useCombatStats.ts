import { CreateCombatStatsRequest, UpdateCombatStatsRequest } from '@/types';
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

  return useApiMutation<any, CreateCombatStatsRequest>(
    '/combat-stats',
    'post',
    {
      onSuccess: (newCombatStats) => {
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

  return useApiMutation<any, { id: string; data: UpdateCombatStatsRequest }>(
    '/combat-stats',
    'put',
    {
      onSuccess: (updatedCombatStats) => {
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

  return useApiMutation<any, string>(
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

  return useApiMutation<
    any,
    { characterId: string; data: Omit<CreateCombatStatsRequest, 'characterId'> }
  >(
    '/combat-stats/upsert',
    'post',
    {
      onSuccess: (combatStats) => {
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
