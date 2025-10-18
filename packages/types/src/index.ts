// Character types
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
  createdAt: Date;
  updatedAt: Date;
}

// Request types
export interface CreateCharacterRequest {
  characterName: string;
  archetype: string;
  faction: string;
  race: string;
  level: number;
  category: string;
  epicPoints: number;
  type: string;
  isNPC?: boolean;
  isVisible?: boolean;
  playerId: string;
}

export interface UpdateCharacterRequest {
  characterName?: string;
  archetype?: string;
  faction?: string;
  race?: string;
  level?: number;
  category?: string;
  epicPoints?: number;
  type?: string;
  isNPC?: boolean;
  isVisible?: boolean;
}

// Combat types
export interface CombatStats {
  id: string;
  characterId: string;
  initiative: number;
  armorClass: number;
  conditions: string[];
}

export interface CreateCombatStatsRequest {
  characterId: string;
  initiative: number;
  armorClass: number;
  conditions: string[];
}

export interface UpdateCombatStatsRequest {
  initiative?: number;
  armorClass?: number;
  conditions?: string[];
}

// Player types
export interface Player {
  id: string;
  name: string;
  userId: string;
}

export interface CreatePlayerRequest {
  name: string;
  userId: string;
}

export interface UpdatePlayerRequest {
  name?: string;
}

// User types
export interface User {
  id: string;
  username: string;
}

export interface CreateUserRequest {
  username: string;
  password: string;
}

export interface UpdateUserRequest {
  username?: string;
  password?: string;
}

// Attribute types
export interface Attribute {
  id: string;
  characterId: string;
  name: string;
  value: number;
}

export interface CreateAttributeRequest {
  characterId: string;
  name: string;
  value: number;
}

export interface UpdateAttributeRequest {
  name?: string;
  value?: number;
}

// Domain types
export interface Domain {
  id: string;
  characterId: string;
  name: string;
  value: number;
}

export interface CreateDomainRequest {
  characterId: string;
  name: string;
  value: number;
}

export interface UpdateDomainRequest {
  name?: string;
  value?: number;
}

// Effect types
export interface Effect {
  id: string;
  characterId: string;
  name: string;
  description: string;
  duration: number;
}

export interface CreateEffectRequest {
  characterId: string;
  name: string;
  description: string;
  duration: number;
}

export interface UpdateEffectRequest {
  name?: string;
  description?: string;
  duration?: number;
}

// Essence types
export interface Essence {
  id: string;
  characterId: string;
  name: string;
  value: number;
}

export interface CreateEssenceRequest {
  characterId: string;
  name: string;
  value: number;
}

export interface UpdateEssenceRequest {
  name?: string;
  value?: number;
}

// Aura Gift types
export interface AuraGift {
  id: string;
  characterId: string;
  name: string;
  description: string;
}

export interface CreateAuraGiftRequest {
  characterId: string;
  name: string;
  description: string;
}

export interface UpdateAuraGiftRequest {
  name?: string;
  description?: string;
}

// Inventory types
export interface Inventory {
  id: string;
  characterId: string;
  items: InventoryItem[];
}

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  description: string;
}

export interface CreateInventoryRequest {
  characterId: string;
  items: Omit<InventoryItem, 'id'>[];
}

export interface UpdateInventoryRequest {
  items?: Omit<InventoryItem, 'id'>[];
}

// Character Relations types
export interface CharacterRelation {
  id: string;
  sourceCharacterId: string;
  targetCharacterId: string;
  relationType: string;
  description: string;
}

export interface CreateCharacterRelationRequest {
  sourceCharacterId: string;
  targetCharacterId: string;
  relationType: string;
  description: string;
}

export interface UpdateCharacterRelationRequest {
  relationType?: string;
  description?: string;
}

// Narrative types
export interface Narrative {
  id: string;
  characterId: string;
  title: string;
  content: string;
  date: Date;
}

export interface CreateNarrativeRequest {
  characterId: string;
  title: string;
  content: string;
}

export interface UpdateNarrativeRequest {
  title?: string;
  content?: string;
}
