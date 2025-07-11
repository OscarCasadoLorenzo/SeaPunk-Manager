import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/essences - Get all essences
router.get('/', async (req, res) => {
  try {
    const essences = await prisma.essence.findMany({
      include: {
        _count: {
          select: { characters: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(essences);
  } catch (error) {
    console.error('Error fetching essences:', error);
    res.status(500).json({ error: 'Failed to fetch essences' });
  }
});

// GET /api/essences/:id - Get a specific essence
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const essence = await prisma.essence.findUnique({
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

    if (!essence) {
      return res.status(404).json({ error: 'Essence not found' });
    }

    res.json(essence);
  } catch (error) {
    console.error('Error fetching essence:', error);
    res.status(500).json({ error: 'Failed to fetch essence' });
  }
});

// GET /api/essences/name/:name - Get essence by name
router.get('/name/:name', async (req, res) => {
  try {
    const { name } = req.params;

    const essence = await prisma.essence.findUnique({
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

    if (!essence) {
      return res.status(404).json({ error: 'Essence not found' });
    }

    res.json(essence);
  } catch (error) {
    console.error('Error fetching essence by name:', error);
    res.status(500).json({ error: 'Failed to fetch essence by name' });
  }
});

// POST /api/essences - Create new essence
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        error: 'Name is required',
      });
    }

    const essence = await prisma.essence.create({
      data: { name },
      include: {
        _count: {
          select: { characters: true },
        },
      },
    });

    res.status(201).json(essence);
  } catch (error: any) {
    console.error('Error creating essence:', error);
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ error: 'Essence with this name already exists' });
    }
    res.status(500).json({ error: 'Failed to create essence' });
  }
});

// PUT /api/essences/:id - Update essence
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const essence = await prisma.essence.update({
      where: { id },
      data: { name },
      include: {
        _count: {
          select: { characters: true },
        },
      },
    });

    res.json(essence);
  } catch (error: any) {
    console.error('Error updating essence:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Essence not found' });
    }
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ error: 'Essence with this name already exists' });
    }
    res.status(500).json({ error: 'Failed to update essence' });
  }
});

// DELETE /api/essences/:id - Delete essence
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.essence.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting essence:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Essence not found' });
    }
    res.status(500).json({ error: 'Failed to delete essence' });
  }
});

export default router;
