import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { BackupImportResponseDto } from "./dto/backup-import-response.dto";
import { BackupMetadataDto } from "./dto/backup-metadata.dto";
import { DatabaseStatsDto } from "./dto/database-stats.dto";
import { ImportStatsDto } from "./dto/import-stats.dto";
import { ResetConfirmationDto } from "./dto/reset-confirmation.dto";
import { ResetResponseDto } from "./dto/reset-response.dto";

interface BackupData {
  metadata: BackupMetadataDto;
  data: {
    users?: any[];
    characters?: any[];
    attributes?: any[];
    domains?: any[];
    combatStats?: any[];
    narratives?: any[];
    inventories?: any[];
    effects?: any[];
    essences?: any[];
    auraGifts?: any[];
    characterEssences?: any[];
    characterAuraGifts?: any[];
  };
}

@Injectable()
export class SettingsService {
  private readonly logger = new Logger(SettingsService.name);

  constructor(private prisma: PrismaService) {}

  async getDatabaseStats(): Promise<DatabaseStatsDto> {
    try {
      const [characters, users] = await Promise.all([
        this.prisma.character.count(),
        this.prisma.user.count(),
      ]);

      return {
        characters,
        users,
      };
    } catch (error) {
      this.logger.error("Error fetching database stats:", error);
      throw new InternalServerErrorException(
        "Error al obtener estadísticas de la base de datos",
      );
    }
  }

  async exportBackup(): Promise<BackupData> {
    try {
      this.logger.log("Starting database export...");

      const [
        users,
        characters,
        attributes,
        domains,
        combatStats,
        narratives,
        inventories,
        effects,
        essences,
        auraGifts,
        characterEssences,
        characterAuraGifts,
      ] = await Promise.all([
        this.prisma.user.findMany(),
        this.prisma.character.findMany(),
        this.prisma.attribute.findMany(),
        this.prisma.domain.findMany(),
        this.prisma.combatStats.findMany(),
        this.prisma.narrative.findMany(),
        this.prisma.inventory.findMany(),
        this.prisma.effect.findMany(),
        this.prisma.essence.findMany(),
        this.prisma.auraGift.findMany(),
        this.prisma.characterEssence.findMany(),
        this.prisma.characterAuraGift.findMany(),
      ]);

      const backup: BackupData = {
        metadata: {
          exportedAt: new Date().toISOString(),
          version: "1.0.0",
          source: "SeaPunk Manager",
          description: "Complete database backup for SeaPunk Manager",
        },
        data: {
          users,
          characters,
          attributes,
          domains,
          combatStats,
          narratives,
          inventories,
          effects,
          essences,
          auraGifts,
          characterEssences,
          characterAuraGifts,
        },
      };

      this.logger.log("Export completed successfully");
      return backup;
    } catch (error) {
      this.logger.error("Error exporting database:", error);
      throw new InternalServerErrorException(
        "Error al exportar la base de datos",
      );
    }
  }

  async resetDatabase(
    resetDto: ResetConfirmationDto,
  ): Promise<ResetResponseDto> {
    try {
      if (resetDto.confirmationPhrase !== "RESET DATABASE") {
        throw new BadRequestException(
          'Debe escribir exactamente "RESET DATABASE" para confirmar',
        );
      }

      this.logger.log("Starting database reset...");

      // Delete all data in the correct order (respecting foreign key constraints)
      await this.prisma.$transaction(async (tx) => {
        // Delete many-to-many relationships first
        await tx.characterAuraGift.deleteMany();
        await tx.characterEssence.deleteMany();

        // Delete dependent tables
        await tx.effect.deleteMany();
        await tx.inventory.deleteMany();
        await tx.narrative.deleteMany();
        await tx.combatStats.deleteMany();
        await tx.domain.deleteMany();
        await tx.attribute.deleteMany();

        // Delete characters
        await tx.character.deleteMany();

        // Delete independent tables
        await tx.auraGift.deleteMany();
        await tx.essence.deleteMany();
        await tx.user.deleteMany();
      });

      this.logger.log("Database reset completed successfully");

      return {
        success: true,
        message: "Base de datos reseteada exitosamente",
        resetAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error("Error resetting database:", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        "Error al resetear la base de datos",
      );
    }
  }

  async importBackup(backupData: BackupData): Promise<BackupImportResponseDto> {
    try {
      this.logger.log("Starting database import...");

      // Validate backup structure
      if (!backupData.data || !backupData.metadata) {
        this.logger.error("Invalid backup structure:", {
          hasData: !!backupData.data,
          hasMetadata: !!backupData.metadata,
        });
        throw new BadRequestException(
          "Formato de backup inválido - debe contener metadata y data",
        );
      }

      // Validate metadata
      if (
        !backupData.metadata.source ||
        backupData.metadata.source !== "SeaPunk Manager"
      ) {
        this.logger.warn(
          "Backup source validation warning:",
          backupData.metadata.source,
        );
      }

      this.logger.log("Backup metadata:", backupData.metadata);

      const { data } = backupData;
      const dataKeys = Object.keys(data);
      this.logger.log("Data tables to import:", dataKeys);

      // Import data in the correct order
      await this.prisma.$transaction(async (tx) => {
        // Import independent tables first
        if (data.users?.length > 0) {
          await tx.user.createMany({ data: data.users, skipDuplicates: true });
        }

        if (data.essences?.length > 0) {
          await tx.essence.createMany({
            data: data.essences,
            skipDuplicates: true,
          });
        }

        if (data.auraGifts?.length > 0) {
          await tx.auraGift.createMany({
            data: data.auraGifts,
            skipDuplicates: true,
          });
        }

        // Import characters
        if (data.characters?.length > 0) {
          await tx.character.createMany({
            data: data.characters,
            skipDuplicates: true,
          });
        }

        // Import character-related data
        if (data.attributes?.length > 0) {
          await tx.attribute.createMany({
            data: data.attributes,
            skipDuplicates: true,
          });
        }

        if (data.domains?.length > 0) {
          await tx.domain.createMany({
            data: data.domains,
            skipDuplicates: true,
          });
        }

        if (data.combatStats?.length > 0) {
          await tx.combatStats.createMany({
            data: data.combatStats,
            skipDuplicates: true,
          });
        }

        if (data.narratives?.length > 0) {
          await tx.narrative.createMany({
            data: data.narratives,
            skipDuplicates: true,
          });
        }

        if (data.inventories?.length > 0) {
          await tx.inventory.createMany({
            data: data.inventories,
            skipDuplicates: true,
          });
        }

        if (data.effects?.length > 0) {
          await tx.effect.createMany({
            data: data.effects,
            skipDuplicates: true,
          });
        }

        // Import many-to-many relationships last
        if (data.characterEssences?.length > 0) {
          await tx.characterEssence.createMany({
            data: data.characterEssences,
            skipDuplicates: true,
          });
        }

        if (data.characterAuraGifts?.length > 0) {
          await tx.characterAuraGift.createMany({
            data: data.characterAuraGifts,
            skipDuplicates: true,
          });
        }
      });

      // Calculate import statistics
      const importStats: ImportStatsDto = {
        users: data.users?.length || 0,
        characters: data.characters?.length || 0,
        attributes: data.attributes?.length || 0,
        domains: data.domains?.length || 0,
        combatStats: data.combatStats?.length || 0,
        narratives: data.narratives?.length || 0,
        inventories: data.inventories?.length || 0,
        effects: data.effects?.length || 0,
        essences: data.essences?.length || 0,
        auraGifts: data.auraGifts?.length || 0,
        characterEssences: data.characterEssences?.length || 0,
        characterAuraGifts: data.characterAuraGifts?.length || 0,
      };

      this.logger.log("Import completed successfully:", importStats);

      return {
        success: true,
        message: "Backup importado exitosamente",
        importedAt: new Date().toISOString(),
        metadata: backupData.metadata,
        importStats,
      };
    } catch (error) {
      this.logger.error("Error importing backup:", error);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException("Error al importar el backup");
    }
  }
}
