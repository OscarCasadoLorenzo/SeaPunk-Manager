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

  return useApiMutation(
    '/attributes',
    'post',
    {
      onSuccess: (newAttribute: any) => {
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

  return useApiMutation(
    '/attributes',
    'put',
    {
      onSuccess: (updatedAttribute: any) => {
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

  return useApiMutation(
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

  return useApiMutation(
    '/attributes/upsert',
    'post',
    {
      onSuccess: (attribute: any) => {
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
