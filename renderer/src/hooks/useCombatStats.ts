import { combatStatsService } from '@/services/combatStats';
import { CreateCombatStatsRequest, UpdateCombatStatsRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCombatStats = (characterId: string) => {
  return useQuery({
    queryKey: ['combatStats', 'character', characterId],
    queryFn: () => combatStatsService.getCombatStatsByCharacterId(characterId),
    enabled: !!characterId,
  });
};

export const useCreateCombatStats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCombatStatsRequest) =>
      combatStatsService.createCombatStats(data),
    onSuccess: (newCombatStats) => {
      queryClient.invalidateQueries({
        queryKey: ['combatStats', 'character', newCombatStats.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['characters', newCombatStats.characterId],
      });
    },
  });
};

export const useUpdateCombatStats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateCombatStatsRequest;
    }) => combatStatsService.updateCombatStats(id, data),
    onSuccess: (updatedCombatStats) => {
      queryClient.invalidateQueries({
        queryKey: ['combatStats', 'character', updatedCombatStats.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['characters', updatedCombatStats.characterId],
      });
    },
  });
};

export const useDeleteCombatStats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => combatStatsService.deleteCombatStats(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['combatStats'] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};

export const useUpsertCombatStats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      characterId,
      data,
    }: {
      characterId: string;
      data: Omit<CreateCombatStatsRequest, 'characterId'>;
    }) => combatStatsService.upsertCombatStats(characterId, data),
    onSuccess: (combatStats) => {
      queryClient.invalidateQueries({
        queryKey: ['combatStats', 'character', combatStats.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['characters', combatStats.characterId],
      });
    },
  });
};
