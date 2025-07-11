import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/aura-gifts - Get all aura gifts
router.get('/', async (req, res) => {
  try {
    const auraGifts = await prisma.auraGift.findMany({
      include: {
        _count: {
          select: { characters: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(auraGifts);
  } catch (error) {
    console.error('Error fetching aura gifts:', error);
    res.status(500).json({ error: 'Failed to fetch aura gifts' });
  }
});

// GET /api/aura-gifts/:id - Get a specific aura gift
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const auraGift = await prisma.auraGift.findUnique({
      where: { id },
      include: {
        characters: {
          include: {
            character: {
              select: {
                id: true,
                characterName: true,
              },
            },
          },
        },
        _count: {
          select: { characters: true },
        },
      },
    });

    if (!auraGift) {
      return res.status(404).json({ error: 'Aura gift not found' });
    }

    res.json(auraGift);
  } catch (error) {
    console.error('Error fetching aura gift:', error);
    res.status(500).json({ error: 'Failed to fetch aura gift' });
  }
});

// GET /api/aura-gifts/name/:name - Get aura gift by name
router.get('/name/:name', async (req, res) => {
  try {
    const { name } = req.params;

    const auraGift = await prisma.auraGift.findUnique({
      where: { name },
      include: {
        characters: {
          include: {
            character: {
              select: {
                id: true,
                characterName: true,
              },
            },
          },
        },
        _count: {
          select: { characters: true },
        },
      },
    });

    if (!auraGift) {
      return res.status(404).json({ error: 'Aura gift not found' });
    }

    res.json(auraGift);
  } catch (error) {
    console.error('Error fetching aura gift by name:', error);
    res.status(500).json({ error: 'Failed to fetch aura gift by name' });
  }
});

// POST /api/aura-gifts - Create new aura gift
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Name is required',
      });
    }

    const auraGift = await prisma.auraGift.create({
      data: { name },
      include: {
        _count: {
          select: { characters: true },
        },
      },
    });

    res.status(201).json(auraGift);
  } catch (error: any) {
    console.error('Error creating aura gift:', error);
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ error: 'Aura gift with this name already exists' });
    }
    res.status(500).json({ error: 'Failed to create aura gift' });
  }
});

// PUT /api/aura-gifts/:id - Update aura gift
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const auraGift = await prisma.auraGift.update({
      where: { id },
      data: { name },
      include: {
        _count: {
          select: { characters: true },
        },
      },
    });

    res.json(auraGift);
  } catch (error: any) {
    console.error('Error updating aura gift:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Aura gift not found' });
    }
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ error: 'Aura gift with this name already exists' });
    }
    res.status(500).json({ error: 'Failed to update aura gift' });
  }
});

// DELETE /api/aura-gifts/:id - Delete aura gift
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.auraGift.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting aura gift:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Aura gift not found' });
    }
    res.status(500).json({ error: 'Failed to delete aura gift' });
  }
});

export default router;
