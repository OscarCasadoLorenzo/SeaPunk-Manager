import { CreateAttributeRequest, UpdateAttributeRequest } from '@/types';
import { useApiQuery, useApiMutation } from '@/hooks/use-api-query';
import { useQueryClient } from '@tanstack/react-query';

export const useAttribute = (characterId: string) => {
  return useApiQuery(
    `/attributes/character/${characterId}`,
    {
      enabled: !!characterId,
    }
  );
};

export const useCreateAttribute = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, CreateAttributeRequest>(
    '/attributes',
    'post',
    {
      onSuccess: (newAttribute) => {
        queryClient.invalidateQueries({
          queryKey: ['/attributes/character', newAttribute.characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', newAttribute.characterId],
        });
      },
    }
  );

export const useUpdateAttribute = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, { id: string; data: UpdateAttributeRequest }>(
    '/attributes',
    'put',
    {
      onSuccess: (updatedAttribute) => {
        queryClient.invalidateQueries({
          queryKey: ['/attributes/character', updatedAttribute.characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', updatedAttribute.characterId],
        });
      },
    }
  );
};

export const useDeleteAttribute = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, string>(
    '/attributes',
    'delete',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/attributes'] });
        queryClient.invalidateQueries({ queryKey: ['/characters'] });
      },
    }
  );
};

export const useUpsertAttribute = () => {
  const queryClient = useQueryClient();

  return useApiMutation<
    any,
    { characterId: string; data: Omit<CreateAttributeRequest, 'characterId'> }
  >(
    '/attributes/upsert',
    'post',
    {
      onSuccess: (attribute) => {
        queryClient.invalidateQueries({
          queryKey: ['/attributes/character', attribute.characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', attribute.characterId],
        });
      },
    }
  );
};
