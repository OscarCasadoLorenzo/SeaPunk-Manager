// CombatStats type for combat_stats table (no id, uses characterId as PK)
export interface CombatStats {
  characterId: number;
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
