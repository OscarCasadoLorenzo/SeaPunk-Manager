import { useApiMutation, useApiQuery } from '@/hooks/use-api-query';
import { fetchApi } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useDomain = (characterId: string) => {
  return useApiQuery(`/domains/character/${characterId}`, {
    enabled: !!characterId,
  });
};

export const useCreateDomain = () => {
  const queryClient = useQueryClient();

  return useApiMutation('/domains', 'post', {
    onSuccess: (newDomain: any) => {
      queryClient.invalidateQueries({
        queryKey: ['/domains/character', newDomain.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['/characters', newDomain.characterId],
      });
    },
  });
};

export const useUpdateDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return fetchApi(`/domains/${id}`, {
        method: 'PATCH',
        body: data,
      });
    },
    onSuccess: (updatedDomain: any) => {
      queryClient.invalidateQueries({
        queryKey: ['/domains/character', updatedDomain.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['/characters', updatedDomain.characterId],
      });
    },
  });
};

export const useDeleteDomain = () => {
  const queryClient = useQueryClient();

  return useApiMutation('/domains', 'delete', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/domains'] });
      queryClient.invalidateQueries({ queryKey: ['/characters'] });
    },
  });
};

export const useUpsertDomain = () => {
  const queryClient = useQueryClient();

  return useApiMutation('/domains/upsert', 'post', {
    onSuccess: (domain: any) => {
      queryClient.invalidateQueries({
        queryKey: ['/domains/character', domain.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['/characters', domain.characterId],
      });
    },
  });
};
