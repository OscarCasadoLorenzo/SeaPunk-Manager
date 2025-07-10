import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Narrative } from '../../types/narrative';
import {
  getAllNarrative,
  createNarrative as ipcCreateNarrative,
  deleteNarrative as ipcDeleteNarrative,
  updateNarrative as ipcUpdateNarrative,
} from '../ipc/narrative';

const fetchNarrative = async (): Promise<Narrative[]> => getAllNarrative();
const getNarrativeByCharacterId = async (
  characterId: number
): Promise<Narrative | undefined> => {
  const all = await getAllNarrative();
  return all.find((a) => a.characterId === characterId);
};
const createNarrative = async (data: Narrative): Promise<Narrative> =>
  ipcCreateNarrative(data);
const updateNarrative = async (
  data: Partial<Narrative> & { characterId: number }
): Promise<Narrative> => ipcUpdateNarrative(data);
const deleteNarrative = async (characterId: number): Promise<Narrative> =>
  ipcDeleteNarrative(characterId);

export function useNarratives() {
  return useQuery({ queryKey: ['narrative'], queryFn: fetchNarrative });
}
export function useNarrative(characterId: number) {
  return useQuery({
    queryKey: ['narrative', characterId],
    queryFn: () => getNarrativeByCharacterId(characterId),
    enabled: !!characterId,
  });
}
export function useCreateNarrative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createNarrative,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['narrative'] }),
  });
}
export function useUpdateNarrative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateNarrative,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['narrative'] }),
  });
}
export function useDeleteNarrative() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteNarrative,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['narrative'] }),
  });
}
