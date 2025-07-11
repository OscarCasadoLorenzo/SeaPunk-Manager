import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// Character Essence Relations

// GET /api/character-essences/character/:characterId - Get character essences
router.get('/character/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;
    const { include } = req.query;

    const includeOptions: any = {
      character: {
        select: {
          id: true,
          characterName: true,
        },
      },
    };

    if (include === 'essence') {
      includeOptions.essence = true;
    }

    const characterEssences = await prisma.characterEssence.findMany({
      where: { characterId },
      include: includeOptions,
      orderBy: { createdAt: 'desc' },
    });

    res.json(characterEssences);
  } catch (error) {
    console.error('Error fetching character essences:', error);
    res.status(500).json({ error: 'Failed to fetch character essences' });
  }
});

// POST /api/character-essences - Add essence to character
router.post('/', async (req, res) => {
  try {
    const { characterId, essenceId } = req.body;

    if (!characterId || !essenceId) {
      return res.status(400).json({
        error: 'Character ID and essence ID are required',
      });
    }

    const characterEssence = await prisma.characterEssence.create({
      data: {
        characterId,
        essenceId,
      },
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
        essence: true,
      },
    });

    res.status(201).json(characterEssence);
  } catch (error: any) {
    console.error('Error adding essence to character:', error);
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ error: 'Character already has this essence' });
    }
    if (error.code === 'P2003') {
      return res
        .status(400)
        .json({ error: 'Invalid character ID or essence ID' });
    }
    res.status(500).json({ error: 'Failed to add essence to character' });
  }
});

// DELETE /api/character-essences/character/:characterId/essence/:essenceId - Remove essence from character
router.delete(
  '/character/:characterId/essence/:essenceId',
  async (req, res) => {
    try {
      const { characterId, essenceId } = req.params;

      await prisma.characterEssence.delete({
        where: {
          characterId_essenceId: {
            characterId,
            essenceId,
          },
        },
      });

      res.status(204).send();
    } catch (error: any) {
      console.error('Error removing essence from character:', error);
      if (error.code === 'P2025') {
        return res
          .status(404)
          .json({ error: 'Character essence relation not found' });
      }
      res
        .status(500)
        .json({ error: 'Failed to remove essence from character' });
    }
  }
);

export default router;
