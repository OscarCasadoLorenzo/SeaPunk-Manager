import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateCharacterEssenceDto {
  @ApiProperty({ description: 'Character ID' })
  @IsNotEmpty()
  @IsString()
  characterId: string;

  @ApiProperty({ description: 'Essence ID' })
  @IsNotEmpty()
  @IsString()
  essenceId: string;

  @ApiProperty({ description: 'Level of the essence', minimum: 1 })
  @IsInt()
  @Min(1)
  level: number;
}
