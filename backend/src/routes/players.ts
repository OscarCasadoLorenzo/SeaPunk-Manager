import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/players - Get all players
router.get('/', async (req, res) => {
  try {
    const players = await prisma.player.findMany({
      include: {
        characters: {
          select: {
            id: true,
            characterName: true,
            level: true,
            archetype: true,
          },
        },
        _count: {
          select: { characters: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    res.status(500).json({ error: 'Failed to fetch players' });
  }
});

// GET /api/players/:id - Get a specific player
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { include } = req.query;

    const includeOptions: any = {};
    if (include === 'characters') {
      includeOptions.characters = {
        include: {
          attributes: true,
          domains: true,
          combatStats: true,
          narrative: true,
        },
      };
    }

    const player = await prisma.player.findUnique({
      where: { id },
      include: includeOptions,
    });

    if (!player) {
      return res.status(404).json({ error: 'Player not found' });
    }

    res.json(player);
  } catch (error) {
    console.error('Error fetching player:', error);
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

// POST /api/players - Create a new player
router.post('/', async (req, res) => {
  try {
    const { playerName } = req.body;

    if (!playerName) {
      return res.status(400).json({ error: 'Player name is required' });
    }

    const player = await prisma.player.create({
      data: { playerName },
      include: {
        _count: {
          select: { characters: true },
        },
      },
    });

    res.status(201).json(player);
  } catch (error) {
    console.error('Error creating player:', error);
    res.status(500).json({ error: 'Failed to create player' });
  }
});

// PUT /api/players/:id - Update a player
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { playerName } = req.body;

    const player = await prisma.player.update({
      where: { id },
      data: { playerName },
      include: {
        _count: {
          select: { characters: true },
        },
      },
    });

    res.json(player);
  } catch (error: any) {
    console.error('Error updating player:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.status(500).json({ error: 'Failed to update player' });
  }
});

// DELETE /api/players/:id - Delete a player
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.player.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting player:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Player not found' });
    }
    res.status(500).json({ error: 'Failed to delete player' });
  }
});

export default router;
