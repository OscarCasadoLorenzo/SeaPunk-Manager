// Domains type for domains table (no id, uses characterId as PK)
export interface Domains {
  characterId: number;
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
