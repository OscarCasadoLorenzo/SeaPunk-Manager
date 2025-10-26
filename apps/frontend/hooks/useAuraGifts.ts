import { useApiMutation, useApiQuery } from '@/hooks/use-api-query';
import { CreateAuraGiftRequest, UpdateAuraGiftRequest } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

export const useAuraGifts = () => {
  return useApiQuery('/aura-gifts');
};

export const useAuraGift = (id: string) => {
  return useApiQuery(`/aura-gifts/${id}`, {
    enabled: !!id,
  });
};

export const useAuraGiftByName = (name: string) => {
  return useApiQuery(`/aura-gifts/name/${name}`, {
    enabled: !!name,
  });
};

export const useCreateAuraGift = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, CreateAuraGiftRequest>('/aura-gifts', 'post', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/aura-gifts'] });
    },
  });
};

export const useUpdateAuraGift = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, { id: string; data: UpdateAuraGiftRequest }>(
    '/aura-gifts',
    'put',
    {
      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({ queryKey: ['/aura-gifts'] });
        queryClient.invalidateQueries({
          queryKey: ['/aura-gifts', variables.id],
        });
      },
    }
  );
};

export const useDeleteAuraGift = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, string>('/aura-gifts', 'delete', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/aura-gifts'] });
    },
  });
};
