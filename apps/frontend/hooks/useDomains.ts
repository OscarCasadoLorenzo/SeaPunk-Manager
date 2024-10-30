import { useApiQuery, useApiMutation } from '@/hooks/use-api-query';
import { useQueryClient } from '@tanstack/react-query';

export const useDomain = (characterId: string) => {
  return useApiQuery(
    `/domains/character/${characterId}`,
    {
      enabled: !!characterId,
    }
  );

export const useCreateDomain = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, CreateDomainRequest>(
    '/domains',
    'post',
    {
      onSuccess: (newDomain) => {
        queryClient.invalidateQueries({
          queryKey: ['/domains/character', newDomain.characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', newDomain.characterId],
        });
      },
    }
  );

export const useUpdateDomain = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, { id: string; data: UpdateDomainRequest }>(
    '/domains',
    'put',
    {
      onSuccess: (updatedDomain) => {
        queryClient.invalidateQueries({
          queryKey: ['/domains/character', updatedDomain.characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', updatedDomain.characterId],
        });
      },
    }
  );

export const useDeleteDomain = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, string>(
    '/domains',
    'delete',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/domains'] });
        queryClient.invalidateQueries({ queryKey: ['/characters'] });
      },
    }
  );

export const useUpsertDomain = () => {
  const queryClient = useQueryClient();

  return useApiMutation<
    any,
    { characterId: string; data: Omit<CreateDomainRequest, 'characterId'> }
  >(
    '/domains/upsert',
    'post',
    {
      onSuccess: (domain) => {
        queryClient.invalidateQueries({
          queryKey: ['/domains/character', domain.characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', domain.characterId],
        });
      },
    }
  );
};
