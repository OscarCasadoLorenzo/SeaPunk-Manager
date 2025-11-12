import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateCharacterAuraGiftDto {
  @ApiProperty({ description: 'Character ID' })
  @IsNotEmpty()
  @IsString()
  characterId: string;

  @ApiProperty({ description: 'Aura Gift ID' })
  @IsNotEmpty()
  @IsString()
  auraGiftId: string;

  @ApiProperty({ description: 'Level of the aura gift', minimum: 1 })
  @IsInt()
  @Min(1)
  level: number;
}
