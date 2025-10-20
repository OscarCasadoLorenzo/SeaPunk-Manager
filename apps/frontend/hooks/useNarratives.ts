import { narrativeService } from '@/services/narratives';
import { CreateNarrativeRequest, UpdateNarrativeRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApiQuery, useApiMutation } from '@/hooks/use-api-query';
import { CreateNarrativeRequest, UpdateNarrativeRequest } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

export const useNarrative = (characterId: string) => {
  return useApiQuery(
    `/narratives/character/${characterId}`,
    {
      enabled: !!characterId,
    }
  );

export const useCreateNarrative = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, CreateNarrativeRequest>(
    '/narratives',
    'post',
    {
      onSuccess: (newNarrative) => {
        queryClient.invalidateQueries({
          queryKey: ['/narratives/character', newNarrative.characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', newNarrative.characterId],
        });
      },
    }
  );
};

export const useUpdateNarrative = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, { id: string; data: UpdateNarrativeRequest }>(
    '/narratives',
    'put',
    {
      onSuccess: (updatedNarrative) => {
        queryClient.invalidateQueries({
          queryKey: ['/narratives/character', updatedNarrative.characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', updatedNarrative.characterId],
        });
      },
    }
  );
};

export const useDeleteNarrative = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, string>(
    '/narratives',
    'delete',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/narratives'] });
        queryClient.invalidateQueries({ queryKey: ['/characters'] });
      },
    }
  );

export const useUpsertNarrative = () => {
  const queryClient = useQueryClient();

  return useApiMutation<
    any,
    { characterId: string; data: Omit<CreateNarrativeRequest, 'characterId'> }
  >(
    '/narratives/upsert',
    'post',
    {
      onSuccess: (narrative) => {
        queryClient.invalidateQueries({
          queryKey: ['/narratives/character', narrative.characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', narrative.characterId],
        });
      },
    }
  );
};
