import { CreatePlayerRequest, Player, UpdatePlayerRequest } from '@/types';
import { api } from './api';

export const playerService = {
  async getPlayers(): Promise<Player[]> {
    const response = await api.get<Player[]>('/players');
    return response.data;
  },

  async getPlayerById(id: string): Promise<Player> {
    const response = await api.get<Player>(`/players/${id}`);
    return response.data;
  },

  async createPlayer(playerData: CreatePlayerRequest): Promise<Player> {
    const response = await api.post<Player>('/players', playerData);
    return response.data;
  },

  async updatePlayer(
    id: string,
    playerData: UpdatePlayerRequest
  ): Promise<Player> {
    const response = await api.put<Player>(`/players/${id}`, playerData);
    return response.data;
  },

  async deletePlayer(id: string): Promise<void> {
    await api.delete(`/players/${id}`);
  },

  async getPlayerWithCharacters(id: string): Promise<Player> {
    const response = await api.get<Player>(`/players/${id}?include=characters`);
    return response.data;
  },
};
