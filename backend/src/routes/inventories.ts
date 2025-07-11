import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/inventories/character/:characterId - Get inventories by character ID
router.get('/character/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;

    const inventories = await prisma.inventory.findMany({
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

    res.json(inventories);
  } catch (error) {
    console.error('Error fetching inventories:', error);
    res.status(500).json({ error: 'Failed to fetch inventories' });
  }
});

// GET /api/inventories/character/:characterId/type/:type - Get inventories by character ID and type
router.get('/character/:characterId/type/:type', async (req, res) => {
  try {
    const { characterId, type } = req.params;

    const inventories = await prisma.inventory.findMany({
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

    res.json(inventories);
  } catch (error) {
    console.error('Error fetching inventories by type:', error);
    res.status(500).json({ error: 'Failed to fetch inventories by type' });
  }
});

// GET /api/inventories/:id - Get a specific inventory item
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const inventory = await prisma.inventory.findUnique({
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

    if (!inventory) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory item:', error);
    res.status(500).json({ error: 'Failed to fetch inventory item' });
  }
});

// POST /api/inventories - Create new inventory item
router.post('/', async (req, res) => {
  try {
    const { characterId, name, description, quantity = 1, type } = req.body;

    if (!characterId || !name || !type) {
      return res.status(400).json({
        error: 'Character ID, name, and type are required',
      });
    }

    const inventory = await prisma.inventory.create({
      data: {
        characterId,
        name,
        description,
        quantity,
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
    });

    res.status(201).json(inventory);
  } catch (error: any) {
    console.error('Error creating inventory item:', error);
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid character ID' });
    }
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

// PUT /api/inventories/:id - Update inventory item
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const inventory = await prisma.inventory.update({
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

    res.json(inventory);
  } catch (error: any) {
    console.error('Error updating inventory item:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

// DELETE /api/inventories/:id - Delete inventory item
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.inventory.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting inventory item:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Inventory item not found' });
    }
    res.status(500).json({ error: 'Failed to delete inventory item' });
  }
});

export default router;
