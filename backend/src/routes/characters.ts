import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/characters - Get all characters
router.get('/', async (req, res) => {
  try {
    const { playerId, isNPC, isVisible, archetype, faction } = req.query;

    const characters = await prisma.character.findMany({
      where: {
        ...(playerId && { playerId: playerId as string }),
        ...(isNPC !== undefined && { isNPC: isNPC === 'true' }),
        ...(isVisible !== undefined && { isVisible: isVisible === 'true' }),
        ...(archetype && { archetype: archetype as string }),
        ...(faction && { faction: faction as string }),
      },
      include: {
        player: {
          select: {
            id: true,
            playerName: true,
          },
        },
        _count: {
          select: {
            inventories: true,
            effects: true,
            essences: true,
            auraGifts: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(characters);
  } catch (error) {
    console.error('Error fetching characters:', error);
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

// GET /api/characters/:id - Get a specific character
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { include } = req.query;

    const includeOptions: any = {
      player: {
        select: {
          id: true,
          playerName: true,
        },
      },
    };

    if (include === 'all') {
      includeOptions.attributes = true;
      includeOptions.domains = true;
      includeOptions.combatStats = true;
      includeOptions.narrative = true;
      includeOptions.inventories = true;
      includeOptions.effects = true;
      includeOptions.essences = {
        include: {
          essence: true,
        },
      };
      includeOptions.auraGifts = {
        include: {
          auraGift: true,
        },
      };
    }

    const character = await prisma.character.findUnique({
      where: { id },
      include: includeOptions,
    });

    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }

    res.json(character);
  } catch (error) {
    console.error('Error fetching character:', error);
    res.status(500).json({ error: 'Failed to fetch character' });
  }
});

// POST /api/characters - Create a new character
router.post('/', async (req, res) => {
  try {
    const {
      characterName,
      archetype,
      faction,
      race,
      level,
      category,
      epicPoints,
      type,
      isNPC = false,
      isVisible = true,
      playerId,
    } = req.body;

    if (!characterName || !archetype || !faction || !race || !playerId) {
      return res.status(400).json({
        error:
          'Character name, archetype, faction, race, and player ID are required',
      });
    }

    const character = await prisma.character.create({
      data: {
        characterName,
        archetype,
        faction,
        race,
        level,
        category,
        epicPoints,
        type,
        isNPC,
        isVisible,
        playerId,
      },
      include: {
        player: {
          select: {
            id: true,
            playerName: true,
          },
        },
      },
    });

    res.status(201).json(character);
  } catch (error: any) {
    console.error('Error creating character:', error);
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid player ID' });
    }
    res.status(500).json({ error: 'Failed to create character' });
  }
});

// PUT /api/characters/:id - Update a character
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const character = await prisma.character.update({
      where: { id },
      data: updateData,
      include: {
        player: {
          select: {
            id: true,
            playerName: true,
          },
        },
      },
    });

    res.json(character);
  } catch (error: any) {
    console.error('Error updating character:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Character not found' });
    }
    res.status(500).json({ error: 'Failed to update character' });
  }
});

// DELETE /api/characters/:id - Delete a character
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.character.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting character:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Character not found' });
    }
    res.status(500).json({ error: 'Failed to delete character' });
  }
});

export default router;
