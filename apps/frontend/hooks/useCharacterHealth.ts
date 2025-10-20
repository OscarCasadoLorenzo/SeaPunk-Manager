import { useApiMutation } from '@/hooks/use-api-query';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

export interface UseCharacterHealthOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: any) => void;
}

/**
 * Hook para gestionar la salud de personajes de forma modular y reutilizable
 */
export const useCharacterHealth = (options: UseCharacterHealthOptions = {}) => {
  const queryClient = useQueryClient();

  // Mutación base para modificar salud
  const healthMutation = useApiMutation<
    any,
    {
      characterId: string;
      changes: {
        physicalHealthChange?: number;
        mentalHealthChange?: number;
        setPhysicalHealth?: number;
        setMentalHealth?: number;
      };
    }
  >('/combat-stats/health', 'put', {
    onSuccess: (data) => {
      console.log('✅ Health updated successfully:', data);
      // Invalidar queries relacionadas para refrescar la UI
      queryClient.invalidateQueries({
        queryKey: ['/characters'],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ['/combat-stats'],
        exact: false,
      });
      console.log('🔄 Queries invalidated');
      options.onSuccess?.(data);
    },
    onError: (error) => {
      console.error('Error modifying character health:', error);
      options.onError?.(error);
    },
  });

  // Función base genérica
  const modifyHealth = useCallback(
    (
      characterId: string,
      changes: {
        physicalHealthChange?: number;
        mentalHealthChange?: number;
        setPhysicalHealth?: number;
        setMentalHealth?: number;
      }
    ) => {
      return healthMutation.mutateAsync({ characterId, changes });
    },
    [healthMutation]
  );

  // Funciones específicas para curar/dañar salud física
  const healPhysicalHealth = useCallback(
    (characterId: string, amount: number = 1) => {
      return modifyHealth(characterId, { physicalHealthChange: amount });
    },
    [modifyHealth]
  );

  const damagePhysicalHealth = useCallback(
    (characterId: string, amount: number = 1) => {
      return modifyHealth(characterId, { physicalHealthChange: -amount });
    },
    [modifyHealth]
  );

  // Funciones específicas para curar/dañar salud mental
  const healMentalHealth = useCallback(
    (characterId: string, amount: number = 1) => {
      return modifyHealth(characterId, { mentalHealthChange: amount });
    },
    [modifyHealth]
  );

  const damageMentalHealth = useCallback(
    (characterId: string, amount: number = 1) => {
      return modifyHealth(characterId, { mentalHealthChange: -amount });
    },
    [modifyHealth]
  );

  // Función para curar ambas saludes
  const healBothHealth = useCallback(
    (
      characterId: string,
      physicalAmount: number = 1,
      mentalAmount: number = 1
    ) => {
      return modifyHealth(characterId, {
        physicalHealthChange: physicalAmount,
        mentalHealthChange: mentalAmount,
      });
    },
    [modifyHealth]
  );

  // Función para dañar ambas saludes
  const damageBothHealth = useCallback(
    (
      characterId: string,
      physicalAmount: number = 1,
      mentalAmount: number = 1
    ) => {
      return modifyHealth(characterId, {
        physicalHealthChange: -physicalAmount,
        mentalHealthChange: -mentalAmount,
      });
    },
    [modifyHealth]
  );

  // Funciones para establecer valores absolutos
  const setPhysicalHealth = useCallback(
    (characterId: string, value: number) => {
      return modifyHealth(characterId, { setPhysicalHealth: value });
    },
    [modifyHealth]
  );

  const setMentalHealth = useCallback(
    (characterId: string, value: number) => {
      return modifyHealth(characterId, { setMentalHealth: value });
    },
    [modifyHealth]
  );

  const setBothHealth = useCallback(
    (characterId: string, physicalValue: number, mentalValue: number) => {
      return modifyHealth(characterId, {
        setPhysicalHealth: physicalValue,
        setMentalHealth: mentalValue,
      });
    },
    [modifyHealth]
  );

  return {
    // Estado de la mutación
    isLoading: healthMutation.isPending,
    error: healthMutation.error,

    // Funciones básicas
    modifyHealth,

    // Funciones de salud física
    healPhysicalHealth,
    damagePhysicalHealth,
    setPhysicalHealth,

    // Funciones de salud mental
    healMentalHealth,
    damageMentalHealth,
    setMentalHealth,

    // Funciones combinadas
    healBothHealth,
    damageBothHealth,
    setBothHealth,
  };
};

export default useCharacterHealth;
