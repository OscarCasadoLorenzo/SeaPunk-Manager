import { PrismaClient } from '@prisma/client';
import express from 'express';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/domains/character/:characterId - Get domains by character ID
router.get('/character/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;

    const domain = await prisma.domain.findUnique({
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

    if (!domain) {
      return res.status(404).json({ error: 'Domains not found' });
    }

    res.json(domain);
  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ error: 'Failed to fetch domains' });
  }
});

// POST /api/domains - Create new domains
router.post('/', async (req, res) => {
  try {
    const {
      characterId,
      physical,
      combat,
      social,
      environmental,
      stealth,
      knowledge,
      technical,
      resources,
      demonic,
      aura,
    } = req.body;

    if (
      !characterId ||
      physical === undefined ||
      combat === undefined ||
      social === undefined ||
      environmental === undefined ||
      stealth === undefined ||
      knowledge === undefined ||
      technical === undefined ||
      resources === undefined ||
      demonic === undefined ||
      aura === undefined
    ) {
      return res.status(400).json({
        error: 'Character ID and all domain values are required',
      });
    }

    const domain = await prisma.domain.create({
      data: {
        characterId,
        physical,
        combat,
        social,
        environmental,
        stealth,
        knowledge,
        technical,
        resources,
        demonic,
        aura,
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

    res.status(201).json(domain);
  } catch (error: any) {
    console.error('Error creating domains:', error);
    if (error.code === 'P2002') {
      return res
        .status(400)
        .json({ error: 'Domains already exist for this character' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid character ID' });
    }
    res.status(500).json({ error: 'Failed to create domains' });
  }
});

// POST /api/domains/upsert/:characterId - Upsert domains
router.post('/upsert/:characterId', async (req, res) => {
  try {
    const { characterId } = req.params;
    const {
      physical,
      combat,
      social,
      environmental,
      stealth,
      knowledge,
      technical,
      resources,
      demonic,
      aura,
    } = req.body;

    const domain = await prisma.domain.upsert({
      where: { characterId },
      update: {
        physical,
        combat,
        social,
        environmental,
        stealth,
        knowledge,
        technical,
        resources,
        demonic,
        aura,
      },
      create: {
        characterId,
        physical,
        combat,
        social,
        environmental,
        stealth,
        knowledge,
        technical,
        resources,
        demonic,
        aura,
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

    res.json(domain);
  } catch (error: any) {
    console.error('Error upserting domains:', error);
    if (error.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid character ID' });
    }
    res.status(500).json({ error: 'Failed to upsert domains' });
  }
});

// PUT /api/domains/:id - Update domains
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const domain = await prisma.domain.update({
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

    res.json(domain);
  } catch (error: any) {
    console.error('Error updating domains:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Domains not found' });
    }
    res.status(500).json({ error: 'Failed to update domains' });
  }
});

// DELETE /api/domains/:id - Delete domains
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.domain.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting domains:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ error: 'Domains not found' });
    }
    res.status(500).json({ error: 'Failed to delete domains' });
  }
});

export default router;
