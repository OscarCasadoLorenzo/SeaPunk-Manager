import { ApiProperty } from '@nestjs/swagger';

export class ResetResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Base de datos reseteada exitosamente',
  })
  message: string;

  @ApiProperty({
    description: 'Timestamp when reset was performed',
    example: '2025-11-04T12:00:00.000Z',
  })
  resetAt: string;
}
