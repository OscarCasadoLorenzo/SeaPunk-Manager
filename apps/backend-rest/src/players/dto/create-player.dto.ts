import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePlayerDto {
  @ApiProperty({ description: 'Name of the player' })
  @IsNotEmpty()
  @IsString()
  playerName: string;
}
