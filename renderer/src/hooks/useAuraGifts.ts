import { auraGiftService } from '@/services/auraGifts';
import { CreateAuraGiftRequest, UpdateAuraGiftRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAuraGifts = () => {
  return useQuery({
    queryKey: ['auraGifts'],
    queryFn: auraGiftService.getAuraGifts,
  });
};

export const useAuraGift = (id: string) => {
  return useQuery({
    queryKey: ['auraGifts', id],
    queryFn: () => auraGiftService.getAuraGiftById(id),
    enabled: !!id,
  });
};

export const useAuraGiftByName = (name: string) => {
  return useQuery({
    queryKey: ['auraGifts', 'name', name],
    queryFn: () => auraGiftService.getAuraGiftByName(name),
    enabled: !!name,
  });
};

export const useCreateAuraGift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAuraGiftRequest) =>
      auraGiftService.createAuraGift(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auraGifts'] });
    },
  });
};

export const useUpdateAuraGift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAuraGiftRequest }) =>
      auraGiftService.updateAuraGift(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['auraGifts'] });
      queryClient.invalidateQueries({ queryKey: ['auraGifts', id] });
    },
  });
};

export const useDeleteAuraGift = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => auraGiftService.deleteAuraGift(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auraGifts'] });
    },
  });
};
