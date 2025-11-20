export interface Character {
  id: string;
  characterName: string;
  archetype: string;
  faction: string;
  race: string;
  level: number;
  epicPoints: number;
  type: string;
  isNPC: boolean;
  isVisible: boolean;
  userId: string; // Changed from playerId to match backend
  createdAt: string;
  updatedAt: string;
  attributes?: CharacterAttributes;
  domains?: CharacterDomains;
  combatStats?: CombatStats;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
  auraGifts?: unknown[];
  effects?: unknown[];
  inventories?: unknown[];
  narrative?: unknown;
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
  physicalValue: number;
  physicalEssence: string;
  combatValue: number;
  combatEssence: string;
  socialValue: number;
  socialEssence: string;
  environmentalValue: number;
  environmentalEssence: string;
  stealthValue: number;
  stealthEssence: string;
  knowledgeValue: number;
  knowledgeEssence: string;
  technicalValue: number;
  technicalEssence: string;
  resourcesValue: number;
  resourcesEssence: string;
  demonicValue: number;
  demonicEssence: string;
  auraValue: number;
  auraEssence: string;
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
  "id" | "createdAt" | "updatedAt"
>;

// Pagination types
export interface PaginationMeta {
  total: number;
  count: number;
  limit: number;
  offset: number;
  hasMore: boolean;
  currentPage: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Helper type to handle both paginated and non-paginated responses
export type MaybePaginated<T> = T[] | PaginatedResponse<T>;
