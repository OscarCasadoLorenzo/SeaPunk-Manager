export interface Character {
  id: string;
  characterName: string;
  archetype: string;
  faction: string;
  race: string;
  level: number;
  category: string;
  epicPoints: number;
  type: string;
  isNPC: boolean;
  isVisible: boolean;
  playerId: string;
  createdAt: string;
  updatedAt: string;
  attributes?: CharacterAttributes;
  domains?: CharacterDomains;
  combatStats?: CombatStats;
}

export interface CharacterAttributes {
  id: string;
  characterId: string;
  strength: number;
  agility: number;
  willpower: number;
  luck: number;
  intelligence: number;
}

export interface CharacterDomains {
  id: string;
  characterId: string;
  physical: number;
  combat: number;
  social: number;
  environmental: number;
  stealth: number;
  knowledge: number;
  technical: number;
  resources: number;
  demonic: number;
  aura: number;
}

export interface CombatStats {
  id: string;
  characterId: string;
  physicalHealth: number;
  mentalHealth: number;
  auraHealth: number;
  initiative: number;
  defense: number;
  resistance: number;
}

export type CreateCharacterDto = Omit<
  Character,
  'id' | 'createdAt' | 'updatedAt'
>;
