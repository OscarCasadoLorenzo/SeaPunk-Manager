import { useApiMutation, useApiQuery } from '@/hooks/use-api-query';
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

  return useApiMutation('/aura-gifts', 'post', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/aura-gifts'] });
    },
  });
};

export const useUpdateAuraGift = () => {
  const queryClient = useQueryClient();

  return useApiMutation(
    '/aura-gifts',
    'put',
    {
      onSuccess: (_: any, variables: any) => {
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

  return useApiMutation('/aura-gifts', 'delete', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/aura-gifts'] });
    },
  });
};
