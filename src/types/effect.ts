// Effect type for effect table (uses id as PK)
export interface Effect {
  id: number;
  characterId: number;
  name?: string;
  duration?: number;
  type?: string;
  description?: string;
}
