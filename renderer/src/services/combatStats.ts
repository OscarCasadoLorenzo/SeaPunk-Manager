import {
  CombatStats,
  CreateCombatStatsRequest,
  UpdateCombatStatsRequest,
} from '@/types';
import { api } from './api';

export const combatStatsService = {
  async getCombatStatsByCharacterId(
    characterId: string
  ): Promise<CombatStats | null> {
    try {
      const response = await api.get<CombatStats>(
        `/combat-stats/character/${characterId}`
      );
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw error;
    }
  },

  async createCombatStats(
    combatStatsData: CreateCombatStatsRequest
  ): Promise<CombatStats> {
    const response = await api.post<CombatStats>(
      '/combat-stats',
      combatStatsData
    );
    return response.data;
  },

  async updateCombatStats(
    id: string,
    combatStatsData: UpdateCombatStatsRequest
  ): Promise<CombatStats> {
    const response = await api.put<CombatStats>(
      `/combat-stats/${id}`,
      combatStatsData
    );
    return response.data;
  },

  async deleteCombatStats(id: string): Promise<void> {
    await api.delete(`/combat-stats/${id}`);
  },

  async upsertCombatStats(
    characterId: string,
    combatStatsData: Omit<CreateCombatStatsRequest, 'characterId'>
  ): Promise<CombatStats> {
    const response = await api.post<CombatStats>(
      `/combat-stats/upsert/${characterId}`,
      combatStatsData
    );
    return response.data;
  },

  // Health modification functions
  async modifyCharacterHealth(
    characterId: string,
    options: {
      physicalHealthChange?: number;
      mentalHealthChange?: number;
      setPhysicalHealth?: number;
      setMentalHealth?: number;
    }
  ): Promise<CombatStats> {
    const response = await api.patch<CombatStats>(
      `/combat-stats/character/${characterId}/health`,
      options
    );
    return response.data;
  },

  // Convenience functions for common health operations
  async healPhysicalHealth(
    characterId: string,
    amount: number = 1
  ): Promise<CombatStats> {
    return this.modifyCharacterHealth(characterId, {
      physicalHealthChange: amount,
    });
  },

  async damagePhysicalHealth(
    characterId: string,
    amount: number = 1
  ): Promise<CombatStats> {
    return this.modifyCharacterHealth(characterId, {
      physicalHealthChange: -amount,
    });
  },

  async healMentalHealth(
    characterId: string,
    amount: number = 1
  ): Promise<CombatStats> {
    return this.modifyCharacterHealth(characterId, {
      mentalHealthChange: amount,
    });
  },

  async damageMentalHealth(
    characterId: string,
    amount: number = 1
  ): Promise<CombatStats> {
    return this.modifyCharacterHealth(characterId, {
      mentalHealthChange: -amount,
    });
  },

  async healBothHealth(
    characterId: string,
    physicalAmount: number = 1,
    mentalAmount: number = 1
  ): Promise<CombatStats> {
    return this.modifyCharacterHealth(characterId, {
      physicalHealthChange: physicalAmount,
      mentalHealthChange: mentalAmount,
    });
  },
};
