export class CreateCombatStatsDto {
  // Only max values are required for creation
  // Current values will be initialized to match max values in the service
  maxPhysicalHealth: number;
  maxPhysicalResistance: number;
  maxMentalHealth: number;
  maxMentalResistance: number;
  maxInitiative?: number;
  maxDefense?: number;
  maxAttack?: number;
  maxImpact?: number;
  maxDamage?: number;
}
