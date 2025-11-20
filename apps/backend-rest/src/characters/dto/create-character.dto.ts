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
  epicPoints: number;
  type: string;
  isNPC?: boolean;
  isVisible?: boolean;
  userId: string;
  attributes?: CreateAttributeDto;
  domains?: CreateDomainDto;
  combatStats?: CreateCombatStatsDto;
  narrative?: CreateNarrativeDto;
  essences?: string[];
}
