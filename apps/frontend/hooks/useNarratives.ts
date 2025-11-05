import { useApiMutation, useApiQuery } from '@/hooks/use-api-query';
import { useQueryClient } from '@tanstack/react-query';

export const useNarrative = (characterId: string) => {
  return useApiQuery(`/narratives/character/${characterId}`, {
    enabled: !!characterId,
  });
};

export const useCreateNarrative = () => {
  const queryClient = useQueryClient();

  return useApiMutation('/narratives', 'post', {
    onSuccess: (newNarrative: any) => {
      queryClient.invalidateQueries({
        queryKey: ['/narratives/character', newNarrative.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['/characters', newNarrative.characterId],
      });
    },
  });
};

export const useUpdateNarrative = () => {
  const queryClient = useQueryClient();

  return useApiMutation('/narratives', 'put', {
    onSuccess: (updatedNarrative: any) => {
      queryClient.invalidateQueries({
        queryKey: ['/narratives/character', updatedNarrative.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['/characters', updatedNarrative.characterId],
      });
    },
  });
};

export const useDeleteNarrative = () => {
  const queryClient = useQueryClient();

  return useApiMutation('/narratives', 'delete', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/narratives'] });
      queryClient.invalidateQueries({ queryKey: ['/characters'] });
    },
  });
};

export const useUpsertNarrative = () => {
  const queryClient = useQueryClient();

  return useApiMutation('/narratives/upsert', 'post', {
    onSuccess: (narrative: any) => {
      queryClient.invalidateQueries({
        queryKey: ['/narratives/character', narrative.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['/characters', narrative.characterId],
      });
    },
  });
};
