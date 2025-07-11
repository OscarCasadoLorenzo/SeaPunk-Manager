import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// Character Aura Gift Relations

// GET /api/character-aura-gifts/character/:characterId - Get character aura gifts
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

    if (include === 'auraGift') {
      includeOptions.auraGift = true;
    }

    const characterAuraGifts = await prisma.characterAuraGift.findMany({
      where: { characterId },
      include: includeOptions,
      orderBy: { createdAt: 'desc' },
    });

    res.json(characterAuraGifts);
  } catch (error) {
    console.error('Error fetching character aura gifts:', error);
    res.status(500).json({ error: 'Failed to fetch character aura gifts' });
  }
});

// POST /api/character-aura-gifts - Add aura gift to character
router.post('/', async (req, res) => {
  try {
    const { characterId, auraGiftId } = req.body;

    if (!characterId || !auraGiftId) {
      return res.status(400).json({
        error: 'Character ID and aura gift ID are required',
      });
    }

    const characterAuraGift = await prisma.characterAuraGift.create({
      data: {
        characterId,
        auraGiftId,
      },
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
        auraGift: true,
      },
    });

    res.status(201).json(characterAuraGift);
  } catch (error: any) {
    console.error('Error adding aura gift to character:', error);
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ error: 'Character already has this aura gift' });
    }
    if (error.code === 'P2003') {
      return res
        .status(400)
        .json({ error: 'Invalid character ID or aura gift ID' });
    }
    res.status(500).json({ error: 'Failed to add aura gift to character' });
  }
});

// DELETE /api/character-aura-gifts/character/:characterId/aura-gift/:auraGiftId - Remove aura gift from character
router.delete(
  '/character/:characterId/aura-gift/:auraGiftId',
  async (req, res) => {
    try {
      const { characterId, auraGiftId } = req.params;

      await prisma.characterAuraGift.delete({
        where: {
          characterId_auraGiftId: {
            characterId,
            auraGiftId,
          },
        },
      });

      res.status(204).send();
    } catch (error: any) {
      console.error('Error removing aura gift from character:', error);
      if (error.code === 'P2025') {
        return res
          .status(404)
          .json({ error: 'Character aura gift relation not found' });
      }
      res
        .status(500)
        .json({ error: 'Failed to remove aura gift from character' });
    }
  }
);

export default router;
