import {
  characterAuraGiftService,
  characterEssenceService,
} from '@/services/characterRelations';
import {
  CreateCharacterAuraGiftRequest,
  CreateCharacterEssenceRequest,
} from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

// Character Essence hooks
export const useCharacterEssences = (characterId: string) => {
  return useQuery({
    queryKey: ['characterEssences', 'character', characterId],
    queryFn: () => characterEssenceService.getCharacterEssences(characterId),
    enabled: !!characterId,
  });
};

export const useEssencesByCharacter = (characterId: string) => {
  return useQuery({
    queryKey: ['characterEssences', 'character', characterId, 'detailed'],
    queryFn: () => characterEssenceService.getEssencesByCharacter(characterId),
    enabled: !!characterId,
  });
};

export const useAddEssenceToCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCharacterEssenceRequest) =>
      characterEssenceService.addEssenceToCharacter(data),
    onSuccess: (_, { characterId }) => {
      queryClient.invalidateQueries({
        queryKey: ['characterEssences', 'character', characterId],
      });
      queryClient.invalidateQueries({ queryKey: ['characters', characterId] });
    },
  });
};

export const useRemoveEssenceFromCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      characterId,
      essenceId,
    }: {
      characterId: string;
      essenceId: string;
    }) =>
      characterEssenceService.removeEssenceFromCharacter(
        characterId,
        essenceId
      ),
    onSuccess: (_, { characterId }) => {
      queryClient.invalidateQueries({
        queryKey: ['characterEssences', 'character', characterId],
      });
      queryClient.invalidateQueries({ queryKey: ['characters', characterId] });
    },
  });
};

// Character Aura Gift hooks
export const useCharacterAuraGifts = (characterId: string) => {
  return useQuery({
    queryKey: ['characterAuraGifts', 'character', characterId],
    queryFn: () => characterAuraGiftService.getCharacterAuraGifts(characterId),
    enabled: !!characterId,
  });
};

export const useAuraGiftsByCharacter = (characterId: string) => {
  return useQuery({
    queryKey: ['characterAuraGifts', 'character', characterId, 'detailed'],
    queryFn: () =>
      characterAuraGiftService.getAuraGiftsByCharacter(characterId),
    enabled: !!characterId,
  });
};

export const useAddAuraGiftToCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCharacterAuraGiftRequest) =>
      characterAuraGiftService.addAuraGiftToCharacter(data),
    onSuccess: (_, { characterId }) => {
      queryClient.invalidateQueries({
        queryKey: ['characterAuraGifts', 'character', characterId],
      });
      queryClient.invalidateQueries({ queryKey: ['characters', characterId] });
    },
  });
};

export const useRemoveAuraGiftFromCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      characterId,
      auraGiftId,
    }: {
      characterId: string;
      auraGiftId: string;
    }) =>
      characterAuraGiftService.removeAuraGiftFromCharacter(
        characterId,
        auraGiftId
      ),
    onSuccess: (_, { characterId }) => {
      queryClient.invalidateQueries({
        queryKey: ['characterAuraGifts', 'character', characterId],
      });
      queryClient.invalidateQueries({ queryKey: ['characters', characterId] });
    },
  });
};
