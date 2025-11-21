import { PartialType } from "@nestjs/swagger";
import { CreateAttributeDto } from "../../attributes/dto/create-attribute.dto";
import { CreateCombatStatsDto } from "../../combat-stats/dto/create-combat-stats.dto";
import { CreateDomainDto } from "../../domains/dto/create-domain.dto";
import { CreateCharacterDto, CreateNarrativeDto } from "./create-character.dto";

export class UpdateNarrativeDto extends PartialType(CreateNarrativeDto) {}

export class UpdateCharacterDto extends PartialType(CreateCharacterDto) {
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
  attributes?: CreateAttributeDto;
  domains?: CreateDomainDto;
  combatStats?: CreateCombatStatsDto;
  narrative?: UpdateNarrativeDto;
  essences?: string[];
}
