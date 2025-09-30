import { Character as ComponentCharacter } from '@/components/types';
import { Character as ApiCharacter } from '@/types';

/**
 * Transforms API character data to component character format
 */
export function transformApiCharacterToComponent(
  apiCharacter: ApiCharacter
): ComponentCharacter {
  return {
    id: apiCharacter.id,
    playerName: apiCharacter.player?.playerName || '',
    characterName: apiCharacter.characterName,
    archetype: apiCharacter.archetype,
    faction: apiCharacter.faction,
    race: apiCharacter.race,
    level: apiCharacter.level,
    category: apiCharacter.category as ComponentCharacter['category'],

    // Transform attributes (API uses English names, component uses Spanish)
    attributes: {
      fuerza: apiCharacter.attributes?.strength || 0,
      dinamismo: apiCharacter.attributes?.agility || 0,
      voluntad: apiCharacter.attributes?.willpower || 0,
      suerte: apiCharacter.attributes?.luck || 0,
      inteligencia: apiCharacter.attributes?.intelligence || 0,
    },

    // Transform domains
    domains: {
      fisico: apiCharacter.domains?.physical || 0,
      batalla: apiCharacter.domains?.combat || 0,
      social: apiCharacter.domains?.social || 0,
      ambiental: apiCharacter.domains?.environmental || 0,
      ocultacion: apiCharacter.domains?.stealth || 0,
      conocimiento: apiCharacter.domains?.knowledge || 0,
      tecnico: apiCharacter.domains?.technical || 0,
      recursos: apiCharacter.domains?.resources || 0,
      demoniaco: apiCharacter.domains?.demonic || 0,
      aura: apiCharacter.domains?.aura || 0,
    },

    // Transform combat stats
    combat: {
      saludFisica: apiCharacter.combatStats?.physicalHealth || 100,
      maxSaludFisica: apiCharacter.combatStats?.maxPhysicalHealth || 100,
      resistenciaFisica: apiCharacter.combatStats?.physicalResistance || 80,
      maxResistenciaFisica:
        apiCharacter.combatStats?.maxPhysicalResistance || 80,
      saludMental: apiCharacter.combatStats?.mentalHealth || 100,
      maxSaludMental: apiCharacter.combatStats?.maxMentalHealth || 100,
      resistenciaMental: apiCharacter.combatStats?.mentalResistance || 80,
      maxResistenciaMental: apiCharacter.combatStats?.maxMentalResistance || 80,
      iniciativa: apiCharacter.combatStats?.initiative || 10,
      defensa: apiCharacter.combatStats?.defense || 10,
      ataque: apiCharacter.combatStats?.attack || 10,
      impacto: apiCharacter.combatStats?.impact || 10,
      danoMaximo: apiCharacter.combatStats?.maxDamage || 20,
    },

    // Transform narrative
    narrative: {
      descripcionFisica: apiCharacter.narrative?.physicalDescription || '',
      perfilExterno: apiCharacter.narrative?.externalProfile || '',
      perfilInterno: apiCharacter.narrative?.internalProfile || '',
      trasfondo: apiCharacter.narrative?.background || '',
      especialidades: apiCharacter.narrative?.specialties || '',
    },

    // Other fields
    puntosEpica: apiCharacter.epicPoints || 0,
    esencias: apiCharacter.essences?.map((ce) => ce.essence?.name || '') || [],
    donesAura:
      apiCharacter.auraGifts?.map((ag) => ag.auraGift?.name || '') || [],

    // Transform inventory
    inventory:
      apiCharacter.inventories?.map((inv) => ({
        id: inv.id,
        name: inv.name,
        description: inv.description || '',
        quantity: inv.quantity,
        type: inv.type as 'weapon' | 'armor' | 'item' | 'consumable',
      })) || [],

    // Transform effects
    effects:
      apiCharacter.effects?.map((eff) => ({
        id: eff.id,
        name: eff.name,
        duration: eff.duration,
        type: eff.type as 'buff' | 'debuff' | 'neutral',
        description: eff.description || '',
      })) || [],

    // Type and status
    type: apiCharacter.type as ComponentCharacter['type'],
    isNPC: apiCharacter.isNPC,
    visible: apiCharacter.isVisible,

    // Compatibility fields (map combat stats to simple format)
    health: apiCharacter.combatStats?.physicalHealth || 100,
    maxHealth: apiCharacter.combatStats?.maxPhysicalHealth || 100,
    resistance: apiCharacter.combatStats?.physicalResistance || 80,
    maxResistance: apiCharacter.combatStats?.maxPhysicalResistance || 80,
    initiative: apiCharacter.combatStats?.initiative || 10,
    attack: apiCharacter.combatStats?.attack || 10,
    defense: apiCharacter.combatStats?.defense || 10,
  };
}

/**
 * Transforms component character data to API format for updates
 */
export function transformComponentCharacterToApi(
  componentCharacter: ComponentCharacter
): Partial<ApiCharacter> {
  return {
    characterName: componentCharacter.characterName,
    archetype: componentCharacter.archetype,
    faction: componentCharacter.faction,
    race: componentCharacter.race,
    level: componentCharacter.level,
    category: componentCharacter.category,
    epicPoints: componentCharacter.puntosEpica,
    type: componentCharacter.type,
    isNPC: componentCharacter.isNPC,
    isVisible: componentCharacter.visible,
    // Note: Nested objects like attributes, domains, etc. would need separate API calls
    // as they are separate entities in the database
  };
}
