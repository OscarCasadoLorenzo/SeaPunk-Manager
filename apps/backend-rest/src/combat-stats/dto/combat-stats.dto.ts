import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateCombatStatsDto {
  @ApiProperty({ description: 'The character ID for these combat stats' })
  @IsUUID()
  characterId: string;

  @ApiProperty({ description: 'Initiative value for combat' })
  @IsInt()
  initiative: number;

  @ApiProperty({ description: 'Armor class value' })
  @IsInt()
  armorClass: number;

  @ApiProperty({
    description: 'Active conditions on the character',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  conditions?: string[];
}

export class UpdateCombatStatsDto {
  @ApiProperty({ description: 'Initiative value for combat' })
  @IsInt()
  @IsOptional()
  initiative?: number;

  @ApiProperty({ description: 'Armor class value' })
  @IsInt()
  @IsOptional()
  armorClass?: number;

  @ApiProperty({
    description: 'Active conditions on the character',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  conditions?: string[];
}

export class CombatStatsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  initiative: number;

  @ApiProperty()
  armorClass: number;

  @ApiProperty()
  characterId: string;

  @ApiProperty()
  conditions: string[];

  @ApiProperty({ type: () => [EffectResponseDto] })
  activeEffects?: EffectResponseDto[];
}

export class EffectResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  characterId: string;
}
