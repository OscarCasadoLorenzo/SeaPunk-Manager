import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAuraGiftDto {
  @ApiProperty({ description: 'Name of the aura gift' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the aura gift' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
