import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/effects/character/:characterId - Get effects by character ID
router.get('/character/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;

    const effects = await prisma.effect.findMany({
      where: { characterId },
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(effects);
  } catch (error) {
    console.error('Error fetching effects:', error);
    res.status(500).json({ error: 'Failed to fetch effects' });
  }
});

// GET /api/effects/character/:characterId/type/:type - Get effects by character ID and type
router.get('/character/:characterId/type/:type', async (req, res) => {
  try {
    const { characterId, type } = req.params;

    const effects = await prisma.effect.findMany({
      where: {
        characterId,
        type,
      },
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(effects);
  } catch (error) {
    console.error('Error fetching effects by type:', error);
    res.status(500).json({ error: 'Failed to fetch effects by type' });
  }
});

// GET /api/effects/character/:characterId/active - Get active effects (duration > 0)
router.get('/character/:characterId/active', async (req, res) => {
  try {
    const { characterId } = req.params;

    const effects = await prisma.effect.findMany({
      where: {
        characterId,
        duration: {
          gt: 0,
        },
      },
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(effects);
  } catch (error) {
    console.error('Error fetching active effects:', error);
    res.status(500).json({ error: 'Failed to fetch active effects' });
  }
});

// GET /api/effects/:id - Get a specific effect
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const effect = await prisma.effect.findUnique({
      where: { id },
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
      },
    });

    if (!effect) {
      return res.status(404).json({ error: 'Effect not found' });
    }

    res.json(effect);
  } catch (error) {
    console.error('Error fetching effect:', error);
    res.status(500).json({ error: 'Failed to fetch effect' });
  }
});

// POST /api/effects - Create new effect
router.post('/', async (req, res) => {
  try {
    const { characterId, name, duration, type, description } = req.body;

    if (!characterId || !name || duration === undefined || !type) {
      return res.status(400).json({
        error: 'Character ID, name, duration, and type are required',
      });
    }

    const effect = await prisma.effect.create({
      data: {
        characterId,
        name,
        duration,
        type,
        description,
      },
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
      },
    });

    res.status(201).json(effect);
  } catch (error: any) {
    console.error('Error creating effect:', error);
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid character ID' });
    }
    res.status(500).json({ error: 'Failed to create effect' });
  }
});

// PUT /api/effects/:id - Update effect
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const effect = await prisma.effect.update({
      where: { id },
      data: updateData,
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
      },
    });

    res.json(effect);
  } catch (error: any) {
    console.error('Error updating effect:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Effect not found' });
    }
    res.status(500).json({ error: 'Failed to update effect' });
  }
});

// DELETE /api/effects/:id - Delete effect
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.effect.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting effect:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Effect not found' });
    }
    res.status(500).json({ error: 'Failed to delete effect' });
  }
});

export default router;
