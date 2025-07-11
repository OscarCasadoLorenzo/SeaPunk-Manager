import {
  Character,
  CreateCharacterRequest,
  UpdateCharacterRequest,
} from '@/types';
import { api } from './api';

export const characterService = {
  async getCharacters(params?: {
    playerId?: string;
    isNPC?: boolean;
    isVisible?: boolean;
    archetype?: string;
    faction?: string;
  }): Promise<Character[]> {
    const response = await api.get<Character[]>('/characters', { params });
    return response.data;
  },

  async getCharacterById(id: string): Promise<Character> {
    const response = await api.get<Character>(`/characters/${id}`);
    return response.data;
  },

  async createCharacter(
    characterData: CreateCharacterRequest
  ): Promise<Character> {
    const response = await api.post<Character>('/characters', characterData);
    return response.data;
  },

  async updateCharacter(
    id: string,
    characterData: UpdateCharacterRequest
  ): Promise<Character> {
    const response = await api.put<Character>(
      `/characters/${id}`,
      characterData
    );
    return response.data;
  },

  async deleteCharacter(id: string): Promise<void> {
    await api.delete(`/characters/${id}`);
  },

  async getCharacterWithDetails(id: string): Promise<Character> {
    const response = await api.get<Character>(`/characters/${id}?include=all`);
    return response.data;
  },

  async getCharactersByPlayer(playerId: string): Promise<Character[]> {
    const response = await api.get<Character[]>(
      `/characters?playerId=${playerId}`
    );
    return response.data;
  },
};
