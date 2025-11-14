export class CreateCombatStatsDto {
  physicalHealth: number;
  maxPhysicalHealth: number;
  physicalResistance: number;
  maxPhysicalResistance: number;
  mentalHealth: number;
  maxMentalHealth: number;
  mentalResistance: number;
  maxMentalResistance: number;
  auraHealth?: number;
  maxAuraHealth?: number;
  auraResistance?: number;
  maxAuraResistance?: number;
  initiative: number;
  armorClass?: number;
  conditions?: string[];
  defense?: number;
  attack?: number;
  impact?: number;
  maxDamage?: number;
}
