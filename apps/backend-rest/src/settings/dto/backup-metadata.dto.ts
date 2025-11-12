import { ApiProperty } from '@nestjs/swagger';

export class BackupMetadataDto {
  @ApiProperty({
    description: 'Timestamp when backup was created',
    example: '2025-11-04T12:00:00.000Z',
  })
  exportedAt: string;

  @ApiProperty({
    description: 'Backup version',
    example: '1.0.0',
  })
  version: string;

  @ApiProperty({
    description: 'Source application',
    example: 'SeaPunk Manager',
  })
  source: string;

  @ApiProperty({
    description: 'Backup description',
    example: 'Complete database backup for SeaPunk Manager',
  })
  description: string;
}
