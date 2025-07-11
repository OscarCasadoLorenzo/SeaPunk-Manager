import { effectService } from '@/services/effects';
import { CreateEffectRequest, UpdateEffectRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useEffects = (characterId: string) => {
  return useQuery({
    queryKey: ['effects', 'character', characterId],
    queryFn: () => effectService.getEffectsByCharacterId(characterId),
    enabled: !!characterId,
  });
};

export const useEffect = (id: string) => {
  return useQuery({
    queryKey: ['effects', id],
    queryFn: () => effectService.getEffectById(id),
    enabled: !!id,
  });
};

export const useEffectsByType = (characterId: string, type: string) => {
  return useQuery({
    queryKey: ['effects', 'character', characterId, 'type', type],
    queryFn: () => effectService.getEffectsByType(characterId, type),
    enabled: !!characterId && !!type,
  });
};

export const useActiveEffects = (characterId: string) => {
  return useQuery({
    queryKey: ['effects', 'character', characterId, 'active'],
    queryFn: () => effectService.getActiveEffects(characterId),
    enabled: !!characterId,
  });
};

export const useCreateEffect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEffectRequest) => effectService.createEffect(data),
    onSuccess: (newEffect) => {
      queryClient.invalidateQueries({
        queryKey: ['effects', 'character', newEffect.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['characters', newEffect.characterId],
      });
    },
  });
};

export const useUpdateEffect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEffectRequest }) =>
      effectService.updateEffect(id, data),
    onSuccess: (updatedEffect, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['effects', id] });
      queryClient.invalidateQueries({
        queryKey: ['effects', 'character', updatedEffect.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['characters', updatedEffect.characterId],
      });
    },
  });
};

export const useDeleteEffect = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => effectService.deleteEffect(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['effects'] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};
