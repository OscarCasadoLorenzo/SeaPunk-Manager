import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Essence } from '../../types/essence';
import {
  getAllEssence,
  createEssence as ipcCreateEssence,
  deleteEssence as ipcDeleteEssence,
  updateEssence as ipcUpdateEssence,
} from '../ipc/essence';

const fetchEssence = async (): Promise<Essence[]> => getAllEssence();
const getEssenceByCharacterId = async (
  characterId: number
): Promise<Essence | undefined> => {
  const all = await getAllEssence();
  return all.find((a) => a.characterId === characterId);
};
const createEssence = async (data: Essence): Promise<Essence> =>
  ipcCreateEssence(data);
const updateEssence = async (
  data: Partial<Essence> & { characterId: number }
): Promise<Essence> => ipcUpdateEssence(data);
const deleteEssence = async (characterId: number): Promise<Essence> =>
  ipcDeleteEssence(characterId);

export function useEssenceList() {
  return useQuery({ queryKey: ['essence'], queryFn: fetchEssence });
}
export function useEssence(characterId: number) {
  return useQuery({
    queryKey: ['essence', characterId],
    queryFn: () => getEssenceByCharacterId(characterId),
    enabled: !!characterId,
  });
}
export function useCreateEssence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEssence,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['essence'] }),
  });
}
export function useUpdateEssence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEssence,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['essence'] }),
  });
}
export function useDeleteEssence() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEssence,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['essence'] }),
  });
}
