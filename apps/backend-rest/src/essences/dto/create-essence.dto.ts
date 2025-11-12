import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateEssenceDto {
  @ApiProperty({ description: 'Name of the essence' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the essence' })
  @IsNotEmpty()
  @IsString()
  description: string;
}
