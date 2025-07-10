// Essence type for essence table (no id, uses characterId as PK)
export interface Essence {
  characterId: number;
  name?: string;
}
