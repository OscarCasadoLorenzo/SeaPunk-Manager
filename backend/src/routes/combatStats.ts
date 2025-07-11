import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/combat-stats/character/:characterId - Get combat stats by character ID
router.get('/character/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;

    const combatStats = await prisma.combatStats.findUnique({
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

    if (!combatStats) {
      return res.status(404).json({ error: 'Combat stats not found' });
    }

    res.json(combatStats);
  } catch (error) {
    console.error('Error fetching combat stats:', error);
    res.status(500).json({ error: 'Failed to fetch combat stats' });
  }
});

// POST /api/combat-stats - Create new combat stats
router.post('/', async (req, res) => {
  try {
    const {
      characterId,
      physicalHealth,
      maxPhysicalHealth,
      physicalResistance,
      maxPhysicalResistance,
      mentalHealth,
      maxMentalHealth,
      mentalResistance,
      maxMentalResistance,
      initiative,
      defense,
      attack,
      impact,
      maxDamage,
    } = req.body;

    if (
      !characterId ||
      physicalHealth === undefined ||
      maxPhysicalHealth === undefined ||
      physicalResistance === undefined ||
      maxPhysicalResistance === undefined ||
      mentalHealth === undefined ||
      maxMentalHealth === undefined ||
      mentalResistance === undefined ||
      maxMentalResistance === undefined ||
      initiative === undefined ||
      defense === undefined ||
      attack === undefined ||
      impact === undefined ||
      maxDamage === undefined
    ) {
      return res.status(400).json({
        error: 'Character ID and all combat stat values are required',
      });
    }

    const combatStats = await prisma.combatStats.create({
      data: {
        characterId,
        physicalHealth,
        maxPhysicalHealth,
        physicalResistance,
        maxPhysicalResistance,
        mentalHealth,
        maxMentalHealth,
        mentalResistance,
        maxMentalResistance,
        initiative,
        defense,
        attack,
        impact,
        maxDamage,
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

    res.status(201).json(combatStats);
  } catch (error: any) {
    console.error('Error creating combat stats:', error);
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ error: 'Combat stats already exist for this character' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid character ID' });
    }
    res.status(500).json({ error: 'Failed to create combat stats' });
  }
});

// POST /api/combat-stats/upsert/:characterId - Upsert combat stats
router.post('/upsert/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;
    const {
      physicalHealth,
      maxPhysicalHealth,
      physicalResistance,
      maxPhysicalResistance,
      mentalHealth,
      maxMentalHealth,
      mentalResistance,
      maxMentalResistance,
      initiative,
      defense,
      attack,
      impact,
      maxDamage,
    } = req.body;

    const combatStats = await prisma.combatStats.upsert({
      where: { characterId },
      update: {
        physicalHealth,
        maxPhysicalHealth,
        physicalResistance,
        maxPhysicalResistance,
        mentalHealth,
        maxMentalHealth,
        mentalResistance,
        maxMentalResistance,
        initiative,
        defense,
        attack,
        impact,
        maxDamage,
      },
      create: {
        characterId,
        physicalHealth,
        maxPhysicalHealth,
        physicalResistance,
        maxPhysicalResistance,
        mentalHealth,
        maxMentalHealth,
        mentalResistance,
        maxMentalResistance,
        initiative,
        defense,
        attack,
        impact,
        maxDamage,
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

    res.json(combatStats);
  } catch (error: any) {
    console.error('Error upserting combat stats:', error);
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid character ID' });
    }
    res.status(500).json({ error: 'Failed to upsert combat stats' });
  }
});

// PUT /api/combat-stats/:id - Update combat stats
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const combatStats = await prisma.combatStats.update({
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

    res.json(combatStats);
  } catch (error: any) {
    console.error('Error updating combat stats:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Combat stats not found' });
    }
    res.status(500).json({ error: 'Failed to update combat stats' });
  }
});

// DELETE /api/combat-stats/:id - Delete combat stats
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.combatStats.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting combat stats:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Combat stats not found' });
    }
    res.status(500).json({ error: 'Failed to delete combat stats' });
  }
});

export default router;
