import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Response } from "express";
import { diskStorage } from "multer";
import { extname } from "path";
import { BackupImportResponseDto } from "./dto/backup-import-response.dto";
import { DatabaseStatsDto } from "./dto/database-stats.dto";
import { ResetConfirmationDto } from "./dto/reset-confirmation.dto";
import { ResetResponseDto } from "./dto/reset-response.dto";
import { SettingsService } from "./settings.service";

// Multer file type interface
interface MulterFile {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
}

@ApiTags("settings")
@Controller("settings")
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get("stats")
  @ApiOperation({ summary: "Get database statistics" })
  @ApiResponse({
    status: 200,
    description: "Returns database statistics.",
    type: DatabaseStatsDto,
  })
  async getStats(): Promise<DatabaseStatsDto> {
    return this.settingsService.getDatabaseStats();
  }

  @Get("backup/export")
  @ApiOperation({ summary: "Export complete database backup as JSON" })
  @ApiResponse({
    status: 200,
    description: "Returns database backup as JSON file download.",
  })
  async exportBackup(@Res() res: Response): Promise<void> {
    const backup = await this.settingsService.exportBackup();

    const timestamp = new Date().toISOString().split("T")[0];
    const filename = `seapunk-backup-${timestamp}.json`;

    // Set proper headers for JSON download
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Cache-Control", "no-cache");

    // Send formatted JSON with proper indentation
    const jsonString = JSON.stringify(backup, null, 2);
    res.send(jsonString);
  }

  @Post("backup/reset")
  @ApiOperation({ summary: "Reset database after confirmation" })
  @ApiResponse({
    status: 200,
    description: "Database has been reset successfully.",
    type: ResetResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid confirmation phrase.",
  })
  async resetDatabase(
    @Body() resetDto: ResetConfirmationDto,
  ): Promise<ResetResponseDto> {
    return this.settingsService.resetDatabase(resetDto);
  }

  @Post("backup/import")
  @ApiOperation({ summary: "Import database backup from JSON file" })
  @ApiConsumes("multipart/form-data")
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        backup: {
          type: "string",
          format: "binary",
          description: "JSON backup file",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Backup imported successfully.",
    type: BackupImportResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: "Invalid backup file or format.",
  })
  @UseInterceptors(
    FileInterceptor("backup", {
      storage: diskStorage({
        destination: "./uploads",
        filename: (req, file, callback) => {
          const uniqueSuffix =
            Date.now() + "-" + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname);
          callback(null, `backup-${uniqueSuffix}${ext}`);
        },
      }),
      limits: {
        fileSize: 50 * 1024 * 1024, // 50MB limit
      },
      fileFilter: (req, file, callback) => {
        if (
          file.mimetype === "application/json" ||
          file.originalname.endsWith(".json")
        ) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException("Only JSON files are allowed"),
            false,
          );
        }
      },
    }),
  )
  async importBackup(
    @UploadedFile() file: MulterFile,
  ): Promise<BackupImportResponseDto> {
    if (!file) {
      throw new BadRequestException("No se proporcionó archivo de backup");
    }

    try {
      const fs = await import("fs");
      const fileContent = fs.readFileSync(file.path, "utf-8");

      let backupData;
      try {
        backupData = JSON.parse(fileContent);
      } catch (parseError) {
        throw new BadRequestException("El archivo no contiene JSON válido");
      } finally {
        // Clean up uploaded file
        fs.unlinkSync(file.path);
      }

      return await this.settingsService.importBackup(backupData);
    } catch (error) {
      // Ensure file cleanup even if an error occurs
      try {
        const fs = await import("fs");
        if (file && file.path) {
          fs.unlinkSync(file.path);
        }
      } catch (cleanupError) {
        // Ignore cleanup errors
      }
      throw error;
    }
  }
}
