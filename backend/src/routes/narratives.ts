import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/narratives/character/:characterId - Get narrative by character ID
router.get('/character/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;

    const narrative = await prisma.narrative.findUnique({
      where: { characterId },
      include: {
        character: {
          select: {
            id: true,
            characterName: true,
          },
        },
      },
    });

    if (!narrative) {
      return res.status(404).json({ error: 'Narrative not found' });
    }

    res.json(narrative);
  } catch (error) {
    console.error('Error fetching narrative:', error);
    res.status(500).json({ error: 'Failed to fetch narrative' });
  }
});

// POST /api/narratives - Create new narrative
router.post('/', async (req, res) => {
  try {
    const {
      characterId,
      physicalDescription,
      externalProfile,
      internalProfile,
      background,
      specialties,
    } = req.body;

    if (!characterId) {
      return res.status(400).json({
        error: 'Character ID is required',
      });
    }

    const narrative = await prisma.narrative.create({
      data: {
        characterId,
        physicalDescription,
        externalProfile,
        internalProfile,
        background,
        specialties,
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

    res.status(201).json(narrative);
  } catch (error: any) {
    console.error('Error creating narrative:', error);
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ error: 'Narrative already exists for this character' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid character ID' });
    }
    res.status(500).json({ error: 'Failed to create narrative' });
  }
});

// POST /api/narratives/upsert/:characterId - Upsert narrative
router.post('/upsert/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;
    const {
      physicalDescription,
      externalProfile,
      internalProfile,
      background,
      specialties,
    } = req.body;

    const narrative = await prisma.narrative.upsert({
      where: { characterId },
      update: {
        physicalDescription,
        externalProfile,
        internalProfile,
        background,
        specialties,
      },
      create: {
        characterId,
        physicalDescription,
        externalProfile,
        internalProfile,
        background,
        specialties,
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

    res.json(narrative);
  } catch (error: any) {
    console.error('Error upserting narrative:', error);
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid character ID' });
    }
    res.status(500).json({ error: 'Failed to upsert narrative' });
  }
});

// PUT /api/narratives/:id - Update narrative
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const narrative = await prisma.narrative.update({
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

    res.json(narrative);
  } catch (error: any) {
    console.error('Error updating narrative:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Narrative not found' });
    }
    res.status(500).json({ error: 'Failed to update narrative' });
  }
});

// DELETE /api/narratives/:id - Delete narrative
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.narrative.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting narrative:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Narrative not found' });
    }
    res.status(500).json({ error: 'Failed to delete narrative' });
  }
});

export default router;
