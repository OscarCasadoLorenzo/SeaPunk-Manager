import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

export class CreateEffectDto {
  @ApiProperty({ description: 'Character ID' })
  @IsNotEmpty()
  @IsString()
  characterId: string;

  @ApiProperty({ description: 'Name of the effect' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the effect' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ description: 'Duration of the effect in rounds', minimum: 0 })
  @IsInt()
  @Min(0)
  duration: number;

  @ApiProperty({ description: 'Type of the effect', required: false })
  @IsOptional()
  @IsString()
  type?: string;
}
