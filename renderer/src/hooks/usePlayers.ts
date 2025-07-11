import { playerService } from '@/services/players';
import { CreatePlayerRequest, UpdatePlayerRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const usePlayers = () => {
  return useQuery({
    queryKey: ['players'],
    queryFn: playerService.getPlayers,
  });
};

export const usePlayer = (id: string) => {
  return useQuery({
    queryKey: ['players', id],
    queryFn: () => playerService.getPlayerById(id),
    enabled: !!id,
  });
};

export const usePlayerWithCharacters = (id: string) => {
  return useQuery({
    queryKey: ['players', id, 'characters'],
    queryFn: () => playerService.getPlayerWithCharacters(id),
    enabled: !!id,
  });
};

export const useCreatePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlayerRequest) => playerService.createPlayer(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
};

export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePlayerRequest }) =>
      playerService.updatePlayer(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['players', id] });
    },
  });
};

export const useDeletePlayer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => playerService.deletePlayer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
};
