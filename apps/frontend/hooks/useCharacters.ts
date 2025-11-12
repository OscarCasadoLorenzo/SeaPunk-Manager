import { useApiMutation, useApiQuery } from '@/hooks/use-api-query';
import { fetchApi } from '@/lib/api';
import { Character } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useCharacters = (params?: {
  playerId?: string;
  isNPC?: boolean;
  isVisible?: boolean;
  archetype?: string;
  faction?: string;
}) => {
  return useApiQuery<Character[]>('/characters', { params });
};

export const useCharacter = (id: string) => {
  return useApiQuery<Character>(`/characters/${id}`, {
    enabled: !!id,
  });
};

export const useCharacterWithDetails = (id: string) => {
  return useApiQuery(`/characters/${id}`, {
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

  return useApiMutation('/characters', 'post', {
    onSuccess: (newCharacter: any) => {
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

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return fetchApi(`/characters/${id}`, {
        method: 'PUT',
        body: data,
      });
    },
    onSuccess: (updatedCharacter: any, { id }: any) => {
      queryClient.invalidateQueries({ queryKey: ['/characters'] });
      queryClient.invalidateQueries({ queryKey: [`/characters/${id}`] });
      queryClient.invalidateQueries({
        queryKey: ['/characters/player', updatedCharacter.playerId],
      });
    },
  });
};

export const useDeleteCharacter = () => {
  const queryClient = useQueryClient();

  return useApiMutation('/characters', 'delete', {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/characters'] });
      queryClient.invalidateQueries({ queryKey: ['/players'] });
    },
  });
};
