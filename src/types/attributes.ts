// Attribute type for attributes table (no id, uses characterId as PK)
export interface Attribute {
  characterId: number;
  strength?: number;
  agility?: number;
  willpower?: number;
  luck?: number;
  intelligence?: number;
}
