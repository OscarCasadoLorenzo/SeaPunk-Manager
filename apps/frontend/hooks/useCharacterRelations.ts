import {
  characterAuraGiftService,
  characterEssenceService,
} from '@/services/characterRelations';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useApiQuery, useApiMutation } from '@/hooks/use-api-query';
import { CreateCharacterEssenceRequest, CreateCharacterAuraGiftRequest } from '@/types';


// Character Essence hooks
export const useCharacterEssences = (characterId: string) => {
  return useApiQuery(
    `/character-essences/character/${characterId}`,
    {
      enabled: !!characterId,
    }
  );
};

export const useEssencesByCharacter = (characterId: string) => {
  return useApiQuery(
    `/character-essences/character/${characterId}/detailed`,
    {
      enabled: !!characterId,
    }
  );

export const useAddEssenceToCharacter = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, CreateCharacterEssenceRequest>(
    '/character-essences',
    'post',
    {
      onSuccess: (_, { characterId }) => {
        queryClient.invalidateQueries({
          queryKey: ['/character-essences/character', characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', characterId],
        });
      },
    }
  );

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
  return useApiQuery(
    `/character-aura-gifts/character/${characterId}`,
    {
      enabled: !!characterId,
    }
  );
};

export const useAuraGiftsByCharacter = (characterId: string) => {
  return useApiQuery(
    `/character-aura-gifts/character/${characterId}/detailed`,
    {
      enabled: !!characterId,
    }
  );

export const useAddAuraGiftToCharacter = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, CreateCharacterAuraGiftRequest>(
    '/character-aura-gifts',
    'post',
    {
      onSuccess: (_, { characterId }) => {
        queryClient.invalidateQueries({
          queryKey: ['/character-aura-gifts/character', characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', characterId],
        });
      },
    }
  );
};

export const useRemoveAuraGiftFromCharacter = () => {
  const queryClient = useQueryClient();

  return useApiMutation<
    any,
    { characterId: string; auraGiftId: string }
  >(
    '/character-aura-gifts',
    'delete',
    {
      onSuccess: (_, { characterId }) => {
        queryClient.invalidateQueries({
          queryKey: ['/character-aura-gifts/character', characterId],
        });
        queryClient.invalidateQueries({
          queryKey: ['/characters', characterId],
        });
      },
    }
  );
};
