import { CreateAttributeDto } from '../../attributes/dto/create-attribute.dto';
import { CreateCombatStatsDto } from '../../combat-stats/dto/create-combat-stats.dto';
import { CreateDomainDto } from '../../domains/dto/create-domain.dto';

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
  playerId: string;
  attributes?: CreateAttributeDto;
  domains?: CreateDomainDto;
  combatStats?: CreateCombatStatsDto;
}
