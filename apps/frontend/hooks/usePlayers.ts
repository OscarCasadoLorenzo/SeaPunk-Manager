import { useApiQuery, useApiMutation } from '@/hooks/use-api-query';
import { CreatePlayerRequest, UpdatePlayerRequest } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

export const usePlayers = () => {
  return useApiQuery('/players');
};

export const usePlayer = (id: string) => {
  return useApiQuery(
    `/players/${id}`,
    {
      enabled: !!id,
    }
  );
};

export const usePlayerWithCharacters = (id: string) => {
  return useApiQuery(
    `/players/${id}/characters`,
    {
      enabled: !!id,
    }
  );

export const useCreatePlayer = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, CreatePlayerRequest>(
    '/players',
    'post',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/players'] });
      },
    }
  );
};

export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, { id: string; data: UpdatePlayerRequest }>(
    '/players',
    'put',
    {
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['/players'] });
        queryClient.invalidateQueries({ queryKey: ['/players', id] });
      },
    }
  );
};

export const useDeletePlayer = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, string>(
    '/players',
    'delete',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/players'] });
      },
    }
  );
};
