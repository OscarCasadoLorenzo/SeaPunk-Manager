import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class ResetConfirmationDto {
  @ApiProperty({
    description: 'Confirmation phrase to reset database',
    example: 'RESET DATABASE',
    required: true,
  })
  @IsString()
  confirmationPhrase: string;
}
