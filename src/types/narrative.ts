// Narrative type for narrative table (no id, uses characterId as PK)
export interface Narrative {
  characterId: number;
  physicalDescription?: string;
  externalProfile?: string;
  internalProfile?: string;
  background?: string;
  specialties?: string;
}
