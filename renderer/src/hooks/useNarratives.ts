import { narrativeService } from '@/services/narratives';
import { CreateNarrativeRequest, UpdateNarrativeRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useNarrative = (characterId: string) => {
  return useQuery({
    queryKey: ['narratives', 'character', characterId],
    queryFn: () => narrativeService.getNarrativeByCharacterId(characterId),
    enabled: !!characterId,
  });
};

export const useCreateNarrative = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNarrativeRequest) =>
      narrativeService.createNarrative(data),
    onSuccess: (newNarrative) => {
      queryClient.invalidateQueries({
        queryKey: ['narratives', 'character', newNarrative.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['characters', newNarrative.characterId],
      });
    },
  });
};

export const useUpdateNarrative = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNarrativeRequest }) =>
      narrativeService.updateNarrative(id, data),
    onSuccess: (updatedNarrative) => {
      queryClient.invalidateQueries({
        queryKey: ['narratives', 'character', updatedNarrative.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['characters', updatedNarrative.characterId],
      });
    },
  });
};

export const useDeleteNarrative = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => narrativeService.deleteNarrative(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['narratives'] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};

export const useUpsertNarrative = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      characterId,
      data,
    }: {
      characterId: string;
      data: Omit<CreateNarrativeRequest, 'characterId'>;
    }) => narrativeService.upsertNarrative(characterId, data),
    onSuccess: (narrative) => {
      queryClient.invalidateQueries({
        queryKey: ['narratives', 'character', narrative.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['characters', narrative.characterId],
      });
    },
  });
};
