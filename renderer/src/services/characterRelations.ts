import {
  CharacterAuraGift,
  CharacterEssence,
  CreateCharacterAuraGiftRequest,
  CreateCharacterEssenceRequest,
} from '@/types';
import { api } from './api';

export const characterEssenceService = {
  async getCharacterEssences(characterId: string): Promise<CharacterEssence[]> {
    const response = await api.get<CharacterEssence[]>(
      `/character-essences/character/${characterId}`
    );
    return response.data;
  },

  async addEssenceToCharacter(
    data: CreateCharacterEssenceRequest
  ): Promise<CharacterEssence> {
    const response = await api.post<CharacterEssence>(
      '/character-essences',
      data
    );
    return response.data;
  },

  async removeEssenceFromCharacter(
    characterId: string,
    essenceId: string
  ): Promise<void> {
    await api.delete(
      `/character-essences/character/${characterId}/essence/${essenceId}`
    );
  },

  async getEssencesByCharacter(
    characterId: string
  ): Promise<CharacterEssence[]> {
    const response = await api.get<CharacterEssence[]>(
      `/character-essences/character/${characterId}?include=essence`
    );
    return response.data;
  },
};

export const characterAuraGiftService = {
  async getCharacterAuraGifts(
    characterId: string
  ): Promise<CharacterAuraGift[]> {
    const response = await api.get<CharacterAuraGift[]>(
      `/character-aura-gifts/character/${characterId}`
    );
    return response.data;
  },

  async addAuraGiftToCharacter(
    data: CreateCharacterAuraGiftRequest
  ): Promise<CharacterAuraGift> {
    const response = await api.post<CharacterAuraGift>(
      '/character-aura-gifts',
      data
    );
    return response.data;
  },

  async removeAuraGiftFromCharacter(
    characterId: string,
    auraGiftId: string
  ): Promise<void> {
    await api.delete(
      `/character-aura-gifts/character/${characterId}/aura-gift/${auraGiftId}`
    );
  },

  async getAuraGiftsByCharacter(
    characterId: string
  ): Promise<CharacterAuraGift[]> {
    const response = await api.get<CharacterAuraGift[]>(
      `/character-aura-gifts/character/${characterId}?include=auraGift`
    );
    return response.data;
  },
};
