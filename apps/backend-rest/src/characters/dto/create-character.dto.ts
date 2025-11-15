import { CreateAttributeDto } from "../../attributes/dto/create-attribute.dto";
import { CreateCombatStatsDto } from "../../combat-stats/dto/create-combat-stats.dto";
import { CreateDomainDto } from "../../domains/dto/create-domain.dto";

export class CreateNarrativeDto {
  physicalDescription?: string;
  externalProfile?: string;
  internalProfile?: string;
  background?: string;
  specialties?: string;
}

export class CreateCharacterDto {
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
  userId: string;
  // Legacy fields (optional, for backward compatibility)
  bcat?: number;
  powerLevel?: number;
  physicalResistanceDomain?: string;
  mentalResistanceDomain?: string;
  defenseDomain?: string;
  attackDomain?: string;
  impactDomain?: string;
  attributes?: CreateAttributeDto;
  domains?: CreateDomainDto;
  combatStats?: CreateCombatStatsDto;
  narrative?: CreateNarrativeDto;
}
