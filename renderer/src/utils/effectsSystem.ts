// Sistema de gestión de efectos de combate
import {
  CombatCharacter,
  CombatEffect,
  DurationType,
  EffectModifiers,
} from '../types/combat';
import { generateEffectId } from './combatUtils';

/**
 * Aplica un efecto a un personaje
 */
export function applyEffect(
  character: CombatCharacter,
  effect: Omit<CombatEffect, 'id' | 'characterId' | 'createdAt' | 'updatedAt'>
): CombatCharacter {
  const newEffect: CombatEffect = {
    ...effect,
    id: generateEffectId(),
    characterId: character.id,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const updatedCharacter = {
    ...character,
    combatEffects: [...character.combatEffects, newEffect],
  };

  return recalculateModifiers(updatedCharacter);
}

/**
 * Remueve un efecto específico de un personaje
 */
export function removeEffect(
  character: CombatCharacter,
  effectId: string
): CombatCharacter {
  const updatedCharacter = {
    ...character,
    combatEffects: character.combatEffects.filter(
      (effect) => effect.id !== effectId
    ),
  };

  return recalculateModifiers(updatedCharacter);
}

/**
 * Recalcula todos los modificadores activos de un personaje
 */
export function recalculateModifiers(
  character: CombatCharacter
): CombatCharacter {
  const modifiers: EffectModifiers = {};

  // Inicializar todos los modificadores a 0
  const allModifierKeys: (keyof EffectModifiers)[] = [
    'attack',
    'defense',
    'impact',
    'maxDamage',
    'physicalResistance',
    'mentalResistance',
    'initiative',
    'strength',
    'agility',
    'willpower',
    'luck',
    'intelligence',
    'physical',
    'combat',
    'social',
    'environmental',
    'stealth',
    'knowledge',
    'technical',
    'resources',
    'demonic',
    'aura',
  ];

  allModifierKeys.forEach((key) => {
    modifiers[key] = 0;
  });

  // Sumar modificadores de todos los efectos activos
  character.combatEffects.forEach((effect) => {
    Object.entries(effect.modifiers).forEach(([key, value]) => {
      if (value !== undefined) {
        modifiers[key as keyof EffectModifiers] =
          (modifiers[key as keyof EffectModifiers] || 0) + value;
      }
    });
  });

  return {
    ...character,
    currentModifiers: modifiers,
  };
}

/**
 * Decrementa la duración de efectos según el tipo especificado
 */
export function decrementEffectDurations(
  characters: CombatCharacter[],
  durationType: DurationType
): CombatCharacter[] {
  return characters.map((character) => {
    const updatedEffects = character.combatEffects
      .map((effect) => {
        // Si el efecto es persistente, no se decrementa
        if (effect.persistent) {
          return effect;
        }

        // Solo decrementar si coincide el tipo de duración
        if (effect.durationType === durationType) {
          return {
            ...effect,
            durationValue: effect.durationValue - 1,
            updatedAt: new Date(),
          };
        }

        return effect;
      })
      .filter((effect) => effect.durationValue > 0); // Remover efectos expirados

    const updatedCharacter = {
      ...character,
      combatEffects: updatedEffects,
    };

    return recalculateModifiers(updatedCharacter);
  });
}

/**
 * Decrementa duración de efectos para un personaje específico
 */
export function decrementEffectDurationsForCharacter(
  character: CombatCharacter,
  durationType: DurationType
): CombatCharacter {
  const updatedEffects = character.combatEffects
    .map((effect) => {
      if (effect.persistent || effect.durationType !== durationType) {
        return effect;
      }

      return {
        ...effect,
        durationValue: effect.durationValue - 1,
        updatedAt: new Date(),
      };
    })
    .filter((effect) => effect.durationValue > 0);

  const updatedCharacter = {
    ...character,
    combatEffects: updatedEffects,
  };

  return recalculateModifiers(updatedCharacter);
}

/**
 * Obtiene todos los efectos que están a punto de expirar (duración = 1)
 */
export function getExpiringEffects(character: CombatCharacter): CombatEffect[] {
  return character.combatEffects.filter(
    (effect) => !effect.persistent && effect.durationValue === 1
  );
}

/**
 * Obtiene efectos por origen (ej: "hechizo", "habilidad", "DJ")
 */
export function getEffectsByOrigin(
  character: CombatCharacter,
  origin: string
): CombatEffect[] {
  return character.combatEffects.filter((effect) => effect.origin === origin);
}

/**
 * Modifica un efecto existente
 */
export function modifyEffect(
  character: CombatCharacter,
  effectId: string,
  modifications: Partial<CombatEffect>
): CombatCharacter {
  const updatedEffects = character.combatEffects.map((effect) => {
    if (effect.id === effectId) {
      return {
        ...effect,
        ...modifications,
        updatedAt: new Date(),
      };
    }
    return effect;
  });

  const updatedCharacter = {
    ...character,
    combatEffects: updatedEffects,
  };

  return recalculateModifiers(updatedCharacter);
}

/**
 * Crea efectos temporales comunes para acciones de combate
 */
export const createCommonEffects = {
  /**
   * Efecto de Ataque Total
   */
  attackTotal: (
    combatDomain: number
  ): Omit<CombatEffect, 'id' | 'characterId' | 'createdAt' | 'updatedAt'> => {
    const bonus = Math.floor(combatDomain / 2);
    return {
      name: 'Ataque Total',
      description: `Bono de +${bonus} al ataque e iniciativa`,
      modifiers: {
        attack: bonus,
        initiative: bonus,
      },
      durationType: DurationType.ASALTO,
      durationValue: 1,
      origin: 'accion_combate',
      persistent: false,
    };
  },

  /**
   * Efecto de Defensa Total
   */
  totalDefense: (
    combatDomain: number
  ): Omit<CombatEffect, 'id' | 'characterId' | 'createdAt' | 'updatedAt'> => {
    const bonus = Math.floor(combatDomain / 2);
    return {
      name: 'Defensa Total',
      description: `Bono de +${bonus} a la defensa`,
      modifiers: {
        defense: bonus,
      },
      durationType: DurationType.ASALTO,
      durationValue: 1,
      origin: 'accion_combate',
      persistent: false,
    };
  },

  /**
   * Efecto de Ataque No Letal
   */
  nonLethalAttack: (): Omit<
    CombatEffect,
    'id' | 'characterId' | 'createdAt' | 'updatedAt'
  > => ({
    name: 'Ataque No Letal',
    description: 'Penalización de -2 al ataque, impacto y daño máximo',
    modifiers: {
      attack: -2,
      impact: -2,
      maxDamage: -2,
    },
    durationType: DurationType.TURNO,
    durationValue: 1,
    origin: 'accion_combate',
    persistent: false,
  }),

  /**
   * Efecto de No Actuar
   */
  noAction: (): Omit<
    CombatEffect,
    'id' | 'characterId' | 'createdAt' | 'updatedAt'
  > => ({
    name: 'No Actuar',
    description: 'Bono de +1 a la defensa por no actuar',
    modifiers: {
      defense: 1,
    },
    durationType: DurationType.ASALTO,
    durationValue: 1,
    origin: 'accion_combate',
    persistent: false,
  }),

  /**
   * Efecto de Proteger Aliado
   */
  protectAlly: (): Omit<
    CombatEffect,
    'id' | 'characterId' | 'createdAt' | 'updatedAt'
  > => ({
    name: 'Protegiendo Aliado',
    description: 'Penalización de -3 a la defensa por proteger a un aliado',
    modifiers: {
      defense: -3,
    },
    durationType: DurationType.ASALTO,
    durationValue: 1,
    origin: 'accion_combate',
    persistent: false,
  }),

  /**
   * Efecto de Apuntado (intercambio)
   */
  aimedAttack: (
    type: 'impact' | 'maxDamage'
  ): Omit<CombatEffect, 'id' | 'characterId' | 'createdAt' | 'updatedAt'> => ({
    name: 'Ataque Apuntado',
    description: `Intercambio: -1 ataque por +1 ${type === 'impact' ? 'impacto' : 'daño máximo'}`,
    modifiers: {
      attack: -1,
      [type]: 1,
    },
    durationType: DurationType.TURNO,
    durationValue: 1,
    origin: 'accion_combate',
    persistent: false,
  }),

  /**
   * Efecto de Indefenso (por aprehender)
   */
  helpless: (): Omit<
    CombatEffect,
    'id' | 'characterId' | 'createdAt' | 'updatedAt'
  > => ({
    name: 'Indefenso',
    description: 'El personaje está indefenso y no puede actuar',
    modifiers: {
      defense: -10, // Penalización severa
      attack: -10,
      initiative: -10,
    },
    durationType: DurationType.ASALTO,
    durationValue: 1,
    origin: 'aprehender',
    persistent: false,
  }),
};

/**
 * Verifica si un personaje tiene un efecto específico por nombre
 */
export function hasEffect(
  character: CombatCharacter,
  effectName: string
): boolean {
  return character.combatEffects.some((effect) => effect.name === effectName);
}

/**
 * Cuenta cuántos efectos de un tipo específico tiene un personaje
 */
export function countEffectsByOrigin(
  character: CombatCharacter,
  origin: string
): number {
  return character.combatEffects.filter((effect) => effect.origin === origin)
    .length;
}

/**
 * Limpia todos los efectos no persistentes de un personaje
 */
export function clearNonPersistentEffects(
  character: CombatCharacter
): CombatCharacter {
  const updatedCharacter = {
    ...character,
    combatEffects: character.combatEffects.filter(
      (effect) => effect.persistent
    ),
  };

  return recalculateModifiers(updatedCharacter);
}
