import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateDomainDto {
  @ApiProperty({ description: 'Character ID' })
  @IsNotEmpty()
  @IsString()
  characterId: string;

  @ApiProperty({ description: 'Physical domain value', minimum: 0 })
  @IsInt()
  @Min(0)
  physical: number;

  @ApiProperty({ description: 'Combat domain value', minimum: 0 })
  @IsInt()
  @Min(0)
  combat: number;

  @ApiProperty({ description: 'Social domain value', minimum: 0 })
  @IsInt()
  @Min(0)
  social: number;

  @ApiProperty({ description: 'Environmental domain value', minimum: 0 })
  @IsInt()
  @Min(0)
  environmental: number;

  @ApiProperty({ description: 'Stealth domain value', minimum: 0 })
  @IsInt()
  @Min(0)
  stealth: number;

  @ApiProperty({ description: 'Knowledge domain value', minimum: 0 })
  @IsInt()
  @Min(0)
  knowledge: number;

  @ApiProperty({ description: 'Technical domain value', minimum: 0 })
  @IsInt()
  @Min(0)
  technical: number;

  @ApiProperty({ description: 'Resources domain value', minimum: 0 })
  @IsInt()
  @Min(0)
  resources: number;

  @ApiProperty({ description: 'Demonic domain value', minimum: 0 })
  @IsInt()
  @Min(0)
  demonic: number;

  @ApiProperty({ description: 'Aura domain value', minimum: 0 })
  @IsInt()
  @Min(0)
  aura: number;
}
