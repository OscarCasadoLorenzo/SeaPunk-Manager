import { useApiQuery, useApiMutation } from '@/hooks/use-api-query';
import { CreateEssenceRequest, UpdateEssenceRequest } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

export const useEssences = () => {
  return useApiQuery('/essences');
};

export const useEssence = (id: string) => {
  return useApiQuery(
    `/essences/${id}`,
    {
      enabled: !!id,
    }
  );
};

export const useEssenceByName = (name: string) => {
  return useApiQuery(
    `/essences/name/${name}`,
    {
      enabled: !!name,
    }
  );

export const useCreateEssence = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, CreateEssenceRequest>(
    '/essences',
    'post',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/essences'] });
      },
    }
  );
};

export const useUpdateEssence = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, { id: string; data: UpdateEssenceRequest }>(
    '/essences',
    'put',
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['/essences'] });
        queryClient.invalidateQueries({ queryKey: ['/essences', id] });
      },
    }
  );
};

export const useDeleteEssence = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, string>(
    '/essences',
    'delete',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/essences'] });
      },
    }
  );
};
