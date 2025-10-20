import { effectService } from '@/services/effects';
import { CreateEffectRequest, UpdateEffectRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApiQuery, useApiMutation } from '@/hooks/use-api-query';
import { CreateEffectRequest, UpdateEffectRequest } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

export const useEffects = (characterId: string) => {
  return useApiQuery(
    `/effects/character/${characterId}`,
    {
      enabled: !!characterId,
    }
  );
};

export const useEffect = (id: string) => {
  return useApiQuery(
    `/effects/${id}`,
    {
      enabled: !!id,
    }
  );

export const useEffectsByType = (characterId: string, type: string) => {
  return useApiQuery(
    `/effects/character/${characterId}/type/${type}`,
    {
      enabled: !!characterId && !!type,
    }
  );
};

export const useActiveEffects = (characterId: string) => {
  return useApiQuery(
    `/effects/character/${characterId}/active`,
    {
      enabled: !!characterId,
    }
  );

export const useCreateEffect = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, CreateEffectRequest>(
    '/effects',
    'post',
    {
      onSuccess: (newEffect) => {
        queryClient.invalidateQueries({
          queryKey: ['/effects/character', newEffect.characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', newEffect.characterId],
        });
      },
    }
  );
};

export const useUpdateEffect = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, { id: string; data: UpdateEffectRequest }>(
    '/effects',
    'put',
    {
      onSuccess: (updatedEffect, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['/effects', id] });
        queryClient.invalidateQueries({
          queryKey: ['/effects/character', updatedEffect.characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', updatedEffect.characterId],
        });
      },
    }
  );
};

export const useDeleteEffect = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, string>(
    '/effects',
    'delete',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/effects'] });
        queryClient.invalidateQueries({ queryKey: ['/characters'] });
      },
    }
  );
};
