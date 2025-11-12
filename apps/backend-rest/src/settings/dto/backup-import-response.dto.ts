import { ApiProperty } from '@nestjs/swagger';
import { BackupMetadataDto } from './backup-metadata.dto';
import { ImportStatsDto } from './import-stats.dto';

export class BackupImportResponseDto {
  @ApiProperty({
    description: 'Success status',
    example: true,
  })
  success: boolean;

  @ApiProperty({
    description: 'Response message',
    example: 'Backup importado exitosamente',
  })
  message: string;

  @ApiProperty({
    description: 'Timestamp when backup was imported',
    example: '2025-11-04T12:00:00.000Z',
  })
  importedAt: string;

  @ApiProperty({
    description: 'Original backup metadata',
    type: BackupMetadataDto,
  })
  metadata: BackupMetadataDto;

  @ApiProperty({
    description: 'Statistics of imported data',
    type: ImportStatsDto,
  })
  importStats: ImportStatsDto;
}
