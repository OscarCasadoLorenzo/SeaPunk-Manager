# Settings Module

## Overview

The Settings module provides database management functionality for the SeaPunk Manager application, including:

- Database statistics
- Complete database backup/export
- Database restore/import from backup files
- Database reset functionality

## Features

### 1. Database Statistics

Get a summary count of key database entities.

**Endpoint:** `GET /api/settings/stats`

**Response:**

```json
{
  "characters": 10,
  "players": 5,
  "users": 3
}
```

### 2. Database Export

Export a complete backup of the entire database as a JSON file.

**Endpoint:** `GET /api/settings/backup/export`

**Response:** JSON file download (`seapunk-backup-YYYY-MM-DD.json`)

**Backup Structure:**

```json
{
  "metadata": {
    "exportedAt": "2025-11-04T12:00:00.000Z",
    "version": "1.0.0",
    "source": "SeaPunk Manager",
    "description": "Complete database backup for SeaPunk Manager"
  },
  "data": {
    "users": [...],
    "players": [...],
    "characters": [...],
    "attributes": [...],
    "domains": [...],
    "combatStats": [...],
    "narratives": [...],
    "inventories": [...],
    "effects": [...],
    "auraGifts": [...],
    "characterAuraGifts": [...]
  }
}
```

### 3. Database Import

Import data from a previously exported backup file.

**Endpoint:** `POST /api/settings/backup/import`

**Content-Type:** `multipart/form-data`

**Request:**

- Field name: `backup`
- File type: JSON
- Max file size: 50MB

**Response:**

```json
{
  "success": true,
  "message": "Backup importado exitosamente",
  "importedAt": "2025-11-04T12:00:00.000Z",
  "metadata": {
    "exportedAt": "2025-11-04T11:00:00.000Z",
    "version": "1.0.0",
    "source": "SeaPunk Manager",
    "description": "Complete database backup for SeaPunk Manager"
  },
  "importStats": {
    "users": 3,
    "players": 5,
    "characters": 10,
    "attributes": 10,
    "domains": 10,
    "combatStats": 10,
    "narratives": 10,
    "inventories": 20,
    "effects": 30,
    "auraGifts": 40,
    "characterAuraGifts": 20
  }
}
```

**Import Process:**

1. Validates file format and structure
2. Verifies backup metadata
3. Imports data in correct order (respecting foreign key constraints)
4. Uses `skipDuplicates` to avoid conflicts
5. Returns detailed import statistics

### 4. Database Reset

⚠️ **DANGEROUS OPERATION** - Completely wipes the database.

**Endpoint:** `POST /api/settings/backup/reset`

**Request Body:**

```json
{
  "confirmationPhrase": "RESET DATABASE"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Base de datos reseteada exitosamente",
  "resetAt": "2025-11-04T12:00:00.000Z"
}
```

**Deletion Order:**

1. Many-to-many relationships (characterAuraGift)
2. Dependent tables (effects, inventories, narratives, combatStats, domains, attributes)
3. Characters
4. Independent tables (auraGifts, players, users)

## Architecture

### Module Structure

```
settings/
├── dto/
│   ├── backup-import-response.dto.ts
│   ├── backup-metadata.dto.ts
│   ├── database-stats.dto.ts
│   ├── import-stats.dto.ts
│   ├── reset-confirmation.dto.ts
│   └── reset-response.dto.ts
├── settings.controller.ts
├── settings.module.ts
├── settings.service.ts
└── README.md
```

### DTOs

- **ResetConfirmationDto**: Validates reset confirmation phrase
- **DatabaseStatsDto**: Database statistics response
- **BackupMetadataDto**: Backup file metadata structure
- **ImportStatsDto**: Statistics of imported data
- **BackupImportResponseDto**: Complete import response
- **ResetResponseDto**: Reset operation response

### Service Layer

**SettingsService** handles all business logic:

- `getDatabaseStats()`: Fetches database counts
- `exportBackup()`: Generates complete database backup
- `resetDatabase()`: Wipes all database data
- `importBackup()`: Restores database from backup file

### Controller Layer

**SettingsController** handles HTTP endpoints:

- File upload handling with Multer
- Response streaming for file downloads
- Request validation
- Error handling

## File Upload Configuration

**Multer Settings:**

- Storage: Disk storage in `./uploads` directory
- File size limit: 50MB
- Allowed file types: JSON only (`.json` extension or `application/json` MIME type)
- Filename: `backup-{timestamp}-{random}.json`

**Cleanup:** Uploaded files are automatically deleted after processing, whether successful or not.

## Error Handling

### Common Errors

1. **Invalid Confirmation Phrase** (400)
   - Message: "Debe escribir exactamente 'RESET DATABASE' para confirmar"

2. **No Backup File** (400)
   - Message: "No se proporcionó archivo de backup"

3. **Invalid JSON** (400)
   - Message: "El archivo no contiene JSON válido"

4. **Invalid Backup Structure** (400)
   - Message: "Formato de backup inválido - debe contener metadata y data"

5. **File Type Not Allowed** (400)
   - Message: "Only JSON files are allowed"

6. **Internal Server Error** (500)
   - Generic database or processing errors

## Security Considerations

⚠️ **Important Security Notes:**

1. **No Authentication:** This module does NOT implement authentication. Consider adding authentication guards before deploying to production.

2. **Dangerous Operations:** Reset and import operations can completely destroy or overwrite data. Implement proper authorization.

3. **File Upload Risks:** While file type validation is in place, consider additional security measures for production:
   - Add authentication/authorization
   - Implement rate limiting
   - Add virus scanning
   - Restrict access by IP or role

4. **Backup File Validation:** The import process validates basic structure but trusts the data. Consider adding:
   - Schema validation
   - Data sanitization
   - Backup file signing/verification

## Usage Examples

### Export Backup (cURL)

```bash
curl -X GET http://localhost:3000/api/settings/backup/export \
  -o backup.json
```

### Import Backup (cURL)

```bash
curl -X POST http://localhost:3000/api/settings/backup/import \
  -F "backup=@backup.json"
```

### Reset Database (cURL)

```bash
curl -X POST http://localhost:3000/api/settings/backup/reset \
  -H "Content-Type: application/json" \
  -d '{"confirmationPhrase": "RESET DATABASE"}'
```

### Get Stats (cURL)

```bash
curl -X GET http://localhost:3000/api/settings/stats
```

## Testing

### Manual Testing

1. **Test Export:**

   ```bash
   curl -X GET http://localhost:3000/api/settings/backup/export -o test-backup.json
   ```

2. **Verify Backup File:**
   - Check JSON is valid
   - Verify metadata structure
   - Confirm all data tables present

3. **Test Import:**

   ```bash
   curl -X POST http://localhost:3000/api/settings/backup/import -F "backup=@test-backup.json"
   ```

4. **Test Stats:**
   ```bash
   curl -X GET http://localhost:3000/api/settings/stats
   ```

### Integration Tests

Consider testing:

- Export with empty database
- Export with full database
- Import with existing data (skipDuplicates behavior)
- Import with invalid JSON
- Import with invalid structure
- Reset with incorrect phrase
- Reset with correct phrase
- File size limit enforcement
- File type validation

## Dependencies

- `@nestjs/common`: NestJS core functionality
- `@nestjs/platform-express`: Express integration (includes Multer)
- `@nestjs/swagger`: API documentation
- `@prisma/client`: Database access
- `@types/multer`: TypeScript definitions for file uploads

## Future Enhancements

1. **Authentication/Authorization:**
   - Add JWT authentication
   - Implement role-based access control
   - Add audit logging

2. **Backup Improvements:**
   - Scheduled automatic backups
   - Backup versioning
   - Incremental backups
   - Cloud storage integration (S3, Azure Blob)

3. **Validation:**
   - Schema validation for imports
   - Data integrity checks
   - Backup file encryption

4. **Performance:**
   - Streaming for large files
   - Compression support
   - Background job processing

5. **Monitoring:**
   - Backup/restore metrics
   - Alert on failures
   - Backup health checks

## Maintenance

### Uploads Directory

The `./uploads` directory is used for temporary file storage during imports. Files are automatically cleaned up, but periodic checks are recommended:

```bash
# Clean old files (if any remain)
cd apps/backend-rest/uploads
rm -rf *
```

### Backup Strategy

Recommended backup strategy for production:

1. **Daily Automated Exports:** Schedule daily database exports
2. **Retention Policy:** Keep last 30 days of backups
3. **Off-site Storage:** Store backups in external location
4. **Regular Testing:** Test restore process monthly
5. **Encryption:** Encrypt backup files at rest

## Troubleshooting

### Import Fails with Foreign Key Error

**Cause:** Data order or missing relationships

**Solution:** Ensure backup was created with the export endpoint and hasn't been manually modified.

### File Upload Fails

**Cause:** File size or type restrictions

**Solution:**

- Verify file is JSON format
- Check file size is under 50MB
- Ensure `uploads/` directory exists and is writable

### Reset Doesn't Complete

**Cause:** Foreign key constraints or locked transactions

**Solution:**

- Check for active connections
- Ensure no other operations are running
- Review Prisma transaction timeout settings

## Support

For issues or questions:

1. Check application logs for detailed error messages
2. Review Prisma query logs
3. Verify database connection
4. Check file system permissions for `uploads/` directory
