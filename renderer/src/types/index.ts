export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
  _count?: {
    tasks: number;
  };
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  userId: string;
  user?: User;
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  userId: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  completed?: boolean;
  priority?: Priority;
  dueDate?: string;
}

// Character-related types
export interface Player {
  id: string;
  playerName: string;
  createdAt: string;
  updatedAt: string;
  characters?: Character[];
  _count?: {
    characters: number;
  };
}

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
  player?: Player;
  attributes?: Attribute;
  domains?: Domain;
  combatStats?: CombatStats;
  narrative?: Narrative;
  inventories?: Inventory[];
  effects?: Effect[];
  essences?: CharacterEssence[];
  auraGifts?: CharacterAuraGift[];
  _count?: {
    inventories: number;
    effects: number;
    essences: number;
    auraGifts: number;
  };
}

export interface Attribute {
  id: string;
  characterId: string;
  strength: number;
  agility: number;
  willpower: number;
  luck: number;
  intelligence: number;
  character?: Character;
}

export interface Domain {
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
  character?: Character;
}

export interface CombatStats {
  id: string;
  characterId: string;
  physicalHealth: number;
  maxPhysicalHealth: number;
  physicalResistance: number;
  maxPhysicalResistance: number;
  mentalHealth: number;
  maxMentalHealth: number;
  mentalResistance: number;
  maxMentalResistance: number;
  initiative: number;
  defense: number;
  attack: number;
  impact: number;
  maxDamage: number;
  character?: Character;
}

export interface Narrative {
  id: string;
  characterId: string;
  physicalDescription?: string;
  externalProfile?: string;
  internalProfile?: string;
  background?: string;
  specialties?: string;
  character?: Character;
}

export interface Inventory {
  id: string;
  characterId: string;
  name: string;
  description?: string;
  quantity: number;
  type: string;
  createdAt: string;
  updatedAt: string;
  character?: Character;
}

export interface Effect {
  id: string;
  characterId: string;
  name: string;
  duration: number;
  type: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  character?: Character;
}

export interface Essence {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  characters?: CharacterEssence[];
  _count?: {
    characters: number;
  };
}

export interface AuraGift {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  characters?: CharacterAuraGift[];
  _count?: {
    characters: number;
  };
}

export interface CharacterEssence {
  id: string;
  characterId: string;
  essenceId: string;
  createdAt: string;
  character?: Character;
  essence?: Essence;
}

export interface CharacterAuraGift {
  id: string;
  characterId: string;
  auraGiftId: string;
  createdAt: string;
  character?: Character;
  auraGift?: AuraGift;
}

// Create/Update request types
export interface CreatePlayerRequest {
  playerName: string;
}

export interface UpdatePlayerRequest {
  playerName?: string;
}

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
  playerId?: string;
}

export interface CreateAttributeRequest {
  characterId: string;
  strength: number;
  agility: number;
  willpower: number;
  luck: number;
  intelligence: number;
}

export interface UpdateAttributeRequest {
  strength?: number;
  agility?: number;
  willpower?: number;
  luck?: number;
  intelligence?: number;
}

export interface CreateDomainRequest {
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

export interface UpdateDomainRequest {
  physical?: number;
  combat?: number;
  social?: number;
  environmental?: number;
  stealth?: number;
  knowledge?: number;
  technical?: number;
  resources?: number;
  demonic?: number;
  aura?: number;
}

export interface CreateCombatStatsRequest {
  characterId: string;
  physicalHealth: number;
  maxPhysicalHealth: number;
  physicalResistance: number;
  maxPhysicalResistance: number;
  mentalHealth: number;
  maxMentalHealth: number;
  mentalResistance: number;
  maxMentalResistance: number;
  initiative: number;
  defense: number;
  attack: number;
  impact: number;
  maxDamage: number;
}

export interface UpdateCombatStatsRequest {
  physicalHealth?: number;
  maxPhysicalHealth?: number;
  physicalResistance?: number;
  maxPhysicalResistance?: number;
  mentalHealth?: number;
  maxMentalHealth?: number;
  mentalResistance?: number;
  maxMentalResistance?: number;
  initiative?: number;
  defense?: number;
  attack?: number;
  impact?: number;
  maxDamage?: number;
}

export interface CreateNarrativeRequest {
  characterId: string;
  physicalDescription?: string;
  externalProfile?: string;
  internalProfile?: string;
  background?: string;
  specialties?: string;
}

export interface UpdateNarrativeRequest {
  physicalDescription?: string;
  externalProfile?: string;
  internalProfile?: string;
  background?: string;
  specialties?: string;
}

export interface CreateInventoryRequest {
  characterId: string;
  name: string;
  description?: string;
  quantity?: number;
  type: string;
}

export interface UpdateInventoryRequest {
  name?: string;
  description?: string;
  quantity?: number;
  type?: string;
}

export interface CreateEffectRequest {
  characterId: string;
  name: string;
  duration: number;
  type: string;
  description?: string;
}

export interface UpdateEffectRequest {
  name?: string;
  duration?: number;
  type?: string;
  description?: string;
}

export interface CreateEssenceRequest {
  name: string;
}

export interface UpdateEssenceRequest {
  name?: string;
}

export interface CreateAuraGiftRequest {
  name: string;
}

export interface UpdateAuraGiftRequest {
  name?: string;
}

export interface CreateCharacterEssenceRequest {
  characterId: string;
  essenceId: string;
}

export interface CreateCharacterAuraGiftRequest {
  characterId: string;
  auraGiftId: string;
}
