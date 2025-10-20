import { useApiMutation, useApiQuery } from '@/hooks/use-api-query';
import { CreateCharacterRequest, UpdateCharacterRequest } from '@/types';
import { useQueryClient } from '@tanstack/react-query';

export const useCharacters = (params?: {
  playerId?: string;
  isNPC?: boolean;
  isVisible?: boolean;
  archetype?: string;
  faction?: string;
}) => {
  return useApiQuery('/characters', { params });
};

export const useCharacter = (id: string) => {
  return useApiQuery(`/characters/${id}`, {
    enabled: !!id,
  });
};

export const useCharacterWithDetails = (id: string) => {
  return useApiQuery(`/characters/${id}/details`, {
    enabled: !!id,
  });
};

export const useCharactersByPlayer = (playerId: string) => {
  return useApiQuery(`/characters/player/${playerId}`, {
    enabled: !!playerId,
  });
};

export const useCreateCharacter = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, CreateCharacterRequest>('/characters', 'post', {
    onSuccess: (newCharacter) => {
      queryClient.invalidateQueries({ queryKey: ['/characters'] });
      queryClient.invalidateQueries({
        queryKey: ['/characters/player', newCharacter.playerId],
      });
      queryClient.invalidateQueries({
        queryKey: ['/players', newCharacter.playerId],
      });
    },
  });
};

export const useUpdateCharacter = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, { id: string; data: UpdateCharacterRequest }>(
    '/characters',
    'put',
    {
      onSuccess: (updatedCharacter, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['/characters'] });
        queryClient.invalidateQueries({ queryKey: ['/characters', id] });
        queryClient.invalidateQueries({
          queryKey: ['/characters/player', updatedCharacter.playerId],
        });
      },
    }
  );
};

export const useDeleteCharacter = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, string>('/characters', 'delete', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/characters'] });
      queryClient.invalidateQueries({ queryKey: ['/players'] });
    },
  });
};
