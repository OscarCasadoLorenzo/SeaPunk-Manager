import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CombatStats } from '../../types/combatstats';
import {
  getAllCombatStats,
  createCombatStats as ipcCreateCombatStats,
  deleteCombatStats as ipcDeleteCombatStats,
  updateCombatStats as ipcUpdateCombatStats,
} from '../ipc/combatstats';

const fetchCombatStats = async (): Promise<CombatStats[]> =>
  getAllCombatStats();
const getCombatStatsByCharacterId = async (
  characterId: number
): Promise<CombatStats | undefined> => {
  const all = await getAllCombatStats();
  return all.find((a) => a.characterId === characterId);
};
const createCombatStat = async (data: CombatStats): Promise<CombatStats> =>
  ipcCreateCombatStats(data);
const updateCombatStat = async (
  data: Partial<CombatStats> & { characterId: number }
): Promise<CombatStats> => ipcUpdateCombatStats(data);
const deleteCombatStat = async (characterId: number): Promise<CombatStats> =>
  ipcDeleteCombatStats(characterId);

export function useCombatStats() {
  return useQuery({ queryKey: ['combatStats'], queryFn: fetchCombatStats });
}
export function useCombatStat(characterId: number) {
  return useQuery({
    queryKey: ['combatStats', characterId],
    queryFn: () => getCombatStatsByCharacterId(characterId),
    enabled: !!characterId,
  });
}
export function useCreateCombatStat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCombatStat,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['combatStats'] }),
  });
}
export function useUpdateCombatStat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCombatStat,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['combatStats'] }),
  });
}
export function useDeleteCombatStat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCombatStat,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['combatStats'] }),
  });
}
