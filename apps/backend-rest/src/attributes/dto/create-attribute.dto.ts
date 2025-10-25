import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateAttributeDto {
  @ApiProperty({ description: 'Character ID' })
  @IsNotEmpty()
  @IsString()
  characterId: string;

  @ApiProperty({ description: 'Strength value', minimum: 0 })
  @IsInt()
  @Min(0)
  strength: number;

  @ApiProperty({ description: 'Agility value', minimum: 0 })
  @IsInt()
  @Min(0)
  agility: number;

  @ApiProperty({ description: 'Willpower value', minimum: 0 })
  @IsInt()
  @Min(0)
  willpower: number;

  @ApiProperty({ description: 'Luck value', minimum: 0 })
  @IsInt()
  @Min(0)
  luck: number;

  @ApiProperty({ description: 'Intelligence value', minimum: 0 })
  @IsInt()
  @Min(0)
  intelligence: number;
}
