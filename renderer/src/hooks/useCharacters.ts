import { characterService } from '@/services/characters';
import { CreateCharacterRequest, UpdateCharacterRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useCharacters = (params?: {
  playerId?: string;
  isNPC?: boolean;
  isVisible?: boolean;
  archetype?: string;
  faction?: string;
}) => {
  console.log('useCharacters called with params:', params);
  return useQuery({
    queryKey: ['characters', params],
    queryFn: () => characterService.getCharacters(params),
  });
};

export const useCharacter = (id: string) => {
  return useQuery({
    queryKey: ['characters', id],
    queryFn: () => characterService.getCharacterById(id),
    enabled: !!id,
  });
};

export const useCharacterWithDetails = (id: string) => {
  return useQuery({
    queryKey: ['characters', id, 'details'],
    queryFn: () => characterService.getCharacterWithDetails(id),
    enabled: !!id,
  });
};

export const useCharactersByPlayer = (playerId: string) => {
  return useQuery({
    queryKey: ['characters', 'player', playerId],
    queryFn: () => characterService.getCharactersByPlayer(playerId),
    enabled: !!playerId,
  });
};

export const useCreateCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCharacterRequest) =>
      characterService.createCharacter(data),
    onSuccess: (newCharacter) => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({
        queryKey: ['characters', 'player', newCharacter.playerId],
      });
      queryClient.invalidateQueries({
        queryKey: ['players', newCharacter.playerId],
      });
    },
  });
};

export const useUpdateCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCharacterRequest }) =>
      characterService.updateCharacter(id, data),
    onSuccess: (updatedCharacter, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['characters', id] });
      queryClient.invalidateQueries({
        queryKey: ['characters', 'player', updatedCharacter.playerId],
      });
    },
  });
};

export const useDeleteCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => characterService.deleteCharacter(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
};
