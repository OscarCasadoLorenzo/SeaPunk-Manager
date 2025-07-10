import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { AuraGift } from '../../types/auragift';
import {
  getAllAuraGifts,
  createAuraGift as ipcCreateAuraGift,
  deleteAuraGift as ipcDeleteAuraGift,
  updateAuraGift as ipcUpdateAuraGift,
} from '../ipc/auragifts';

const fetchAuraGift = async (): Promise<AuraGift[]> => getAllAuraGifts();
const getAuraGiftByCharacterId = async (
  characterId: number
): Promise<AuraGift | undefined> => {
  const all = await getAllAuraGifts();
  return all.find((a) => a.characterId === characterId);
};
const createAuraGift = async (data: AuraGift): Promise<AuraGift> =>
  ipcCreateAuraGift(data);
const updateAuraGift = async (
  data: Partial<AuraGift> & { characterId: number }
): Promise<AuraGift> => ipcUpdateAuraGift(data);
const deleteAuraGift = async (characterId: number): Promise<AuraGift> =>
  ipcDeleteAuraGift(characterId);

export function useAuraGiftList() {
  return useQuery({ queryKey: ['auraGift'], queryFn: fetchAuraGift });
}
export function useAuraGift(characterId: number) {
  return useQuery({
    queryKey: ['auraGift', characterId],
    queryFn: () => getAuraGiftByCharacterId(characterId),
    enabled: !!characterId,
  });
}
export function useCreateAuraGift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAuraGift,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auraGift'] }),
  });
}
export function useUpdateAuraGift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAuraGift,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auraGift'] }),
  });
}
export function useDeleteAuraGift() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAuraGift,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['auraGift'] }),
  });
}
