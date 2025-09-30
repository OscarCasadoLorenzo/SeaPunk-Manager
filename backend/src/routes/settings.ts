import { PrismaClient } from '@prisma/client';
import { Request, Router } from 'express';
import multer from 'multer';
import { z } from 'zod';

// Interface for multer file in request
interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const router = Router();
const prisma = new PrismaClient();

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
});

// Validation schemas
const resetConfirmationSchema = z.object({
  confirmationPhrase: z
    .string()
    .refine(
      (phrase) => phrase === 'RESET DATABASE',
      'Must be exactly "RESET DATABASE"'
    ),
});

// GET /api/settings/stats
// Get database statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = {
      characters: await prisma.character.count(),
      players: await prisma.player.count(),
      tasks: await prisma.task.count(),
      users: await prisma.user.count(),
    };
    res.json(stats);
  } catch (error) {
    console.error('Error fetching database stats:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// GET /api/settings/backup/export
// Export complete database backup as JSON
router.get('/backup/export', async (req, res) => {
  try {
    // Export all data from all models
    const backup = {
      metadata: {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        source: 'SeaPunk Manager',
      },
      data: {
        users: await prisma.user.findMany(),
        tasks: await prisma.task.findMany(),
        players: await prisma.player.findMany(),
        characters: await prisma.character.findMany(),
        attributes: await prisma.attribute.findMany(),
        domains: await prisma.domain.findMany(),
        combatStats: await prisma.combatStats.findMany(),
        narratives: await prisma.narrative.findMany(),
        inventories: await prisma.inventory.findMany(),
        effects: await prisma.effect.findMany(),
        essences: await prisma.essence.findMany(),
        auraGifts: await prisma.auraGift.findMany(),
        characterEssences: await prisma.characterEssence.findMany(),
        characterAuraGifts: await prisma.characterAuraGift.findMany(),
      },
    };

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `seapunk-backup-${timestamp}.json`;

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.json(backup);
  } catch (error) {
    console.error('Error exporting database:', error);
    res.status(500).json({ error: 'Error al exportar la base de datos' });
  }
});

// POST /api/settings/backup/reset
// Reset database after confirmation
router.post('/backup/reset', async (req, res) => {
  try {
    const { confirmationPhrase } = resetConfirmationSchema.parse(req.body);

    if (confirmationPhrase !== 'RESET DATABASE') {
      return res.status(400).json({
        error: 'Debe escribir exactamente "RESET DATABASE" para confirmar',
      });
    }

    // Delete all data in the correct order (respecting foreign key constraints)
    await prisma.$transaction(async (tx) => {
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
      await tx.player.deleteMany();
      await tx.task.deleteMany();
      await tx.user.deleteMany();
    });

    res.json({
      success: true,
      message: 'Base de datos reseteada exitosamente',
      resetAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: 'Datos de entrada inválidos' });
    }
    res.status(500).json({ error: 'Error al resetear la base de datos' });
  }
});

// POST /api/settings/backup/import
// Import database backup
router.post(
  '/backup/import',
  upload.single('backup'),
  async (req: MulterRequest, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ error: 'No se proporcionó archivo de backup' });
      }

      const fs = require('fs');
      const backupData = JSON.parse(fs.readFileSync(req.file.path, 'utf-8'));

      // Validate backup structure
      if (!backupData.data || !backupData.metadata) {
        return res.status(400).json({ error: 'Formato de backup inválido' });
      }

      const { data } = backupData;

      // Import data in the correct order
      await prisma.$transaction(async (tx) => {
        // Import independent tables first
        if (data.users?.length > 0) {
          await tx.user.createMany({ data: data.users, skipDuplicates: true });
        }

        if (data.tasks?.length > 0) {
          await tx.task.createMany({ data: data.tasks, skipDuplicates: true });
        }

        if (data.players?.length > 0) {
          await tx.player.createMany({
            data: data.players,
            skipDuplicates: true,
          });
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

      // Clean up uploaded file
      fs.unlinkSync(req.file.path);

      res.json({
        success: true,
        message: 'Backup importado exitosamente',
        importedAt: new Date().toISOString(),
        metadata: backupData.metadata,
      });
    } catch (error) {
      console.error('Error importing backup:', error);

      // Clean up uploaded file if it exists
      if (req.file) {
        const fs = require('fs');
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error('Error cleaning up uploaded file:', cleanupError);
        }
      }

      res.status(500).json({ error: 'Error al importar el backup' });
    }
  }
);

export default router;
