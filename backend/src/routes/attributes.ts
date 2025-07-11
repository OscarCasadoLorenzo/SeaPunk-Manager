import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/attributes/character/:characterId - Get attributes by character ID
router.get('/character/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;

    const attribute = await prisma.attribute.findUnique({
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

    if (!attribute) {
      return res.status(404).json({ error: 'Attributes not found' });
    }

    res.json(attribute);
  } catch (error) {
    console.error('Error fetching attributes:', error);
    res.status(500).json({ error: 'Failed to fetch attributes' });
  }
});

// POST /api/attributes - Create new attributes
router.post('/', async (req, res) => {
  try {
    const { characterId, strength, agility, willpower, luck, intelligence } =
      req.body;

    if (
      !characterId ||
      strength === undefined ||
      agility === undefined ||
      willpower === undefined ||
      luck === undefined ||
      intelligence === undefined
    ) {
      return res.status(400).json({
        error: 'Character ID and all attribute values are required',
      });
    }

    const attribute = await prisma.attribute.create({
      data: {
        characterId,
        strength,
        agility,
        willpower,
        luck,
        intelligence,
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

    res.status(201).json(attribute);
  } catch (error: any) {
    console.error('Error creating attributes:', error);
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ error: 'Attributes already exist for this character' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid character ID' });
    }
    res.status(500).json({ error: 'Failed to create attributes' });
  }
});

// POST /api/attributes/upsert/:characterId - Upsert attributes
router.post('/upsert/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;
    const { strength, agility, willpower, luck, intelligence } = req.body;

    const attribute = await prisma.attribute.upsert({
      where: { characterId },
      update: {
        strength,
        agility,
        willpower,
        luck,
        intelligence,
      },
      create: {
        characterId,
        strength,
        agility,
        willpower,
        luck,
        intelligence,
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

    res.json(attribute);
  } catch (error: any) {
    console.error('Error upserting attributes:', error);
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid character ID' });
    }
    res.status(500).json({ error: 'Failed to upsert attributes' });
  }
});

// PUT /api/attributes/:id - Update attributes
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const attribute = await prisma.attribute.update({
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

    res.json(attribute);
  } catch (error: any) {
    console.error('Error updating attributes:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Attributes not found' });
    }
    res.status(500).json({ error: 'Failed to update attributes' });
  }
});

// DELETE /api/attributes/:id - Delete attributes
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.attribute.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting attributes:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Attributes not found' });
    }
    res.status(500).json({ error: 'Failed to delete attributes' });
  }
});

export default router;
