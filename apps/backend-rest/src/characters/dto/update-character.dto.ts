import { PartialType } from "@nestjs/swagger";
import { CreateAttributeDto } from "../../attributes/dto/create-attribute.dto";
import { CreateCombatStatsDto } from "../../combat-stats/dto/create-combat-stats.dto";
import { CreateDomainDto } from "../../domains/dto/create-domain.dto";
import { CreateNarrativeDto } from "./create-character.dto";

export class UpdateNarrativeDto extends PartialType(CreateNarrativeDto) {}
export class UpdateAttributeDto extends PartialType(CreateAttributeDto) {}
export class UpdateDomainDto extends PartialType(CreateDomainDto) {}
export class UpdateCombatStatsDto extends PartialType(CreateCombatStatsDto) {}

export class UpdateCharacterDto {
  characterName?: string;
  archetype?: string;
  faction?: string;
  race?: string;
  level?: number;
  epicPoints?: number;
  type?: string;
  isNPC?: boolean;
  isVisible?: boolean;
  userId?: string;
  attributes?: UpdateAttributeDto;
  domains?: UpdateDomainDto;
  combatStats?: UpdateCombatStatsDto;
  narrative?: UpdateNarrativeDto;
  essences?: string[];
}
