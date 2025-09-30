import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Starting database seed...');

  try {
    // Create sample users
    const users = [
      {
        email: 'john.doe@example.com',
        name: 'John Doe',
        password: await bcrypt.hash('password123', 10),
      },
      {
        email: 'jane.smith@example.com',
        name: 'Jane Smith',
        password: await bcrypt.hash('password123', 10),
      },
      {
        email: 'admin@example.com',
        name: 'Admin User',
        password: await bcrypt.hash('admin123', 10),
      },
    ];

    const createdUsers = [];
    for (const userData of users) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: {},
        create: userData,
      });
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.email}`);
    }

    // Create sample players
    const players = [
      { playerName: 'Captain Seapunk' },
      { playerName: 'Admiral Coral' },
      { playerName: 'Navigator Pearl' },
    ];

    const createdPlayers = [];
    for (const playerData of players) {
      const player = await prisma.player.create({ data: playerData });
      createdPlayers.push(player);
      console.log(`✅ Created player: ${player.playerName}`);
    }

    // Create sample characters
    const characters = [
      {
        characterName: 'Aqua Knight',
        archetype: 'Warrior',
        faction: 'Oceanic Alliance',
        race: 'Merfolk',
        level: 10,
        category: 'Hero',
        epicPoints: 50,
        type: 'Combat',
        isNPC: false,
        isVisible: true,
        playerId: createdPlayers[0].id,
      },
      {
        characterName: 'Coral Mage',
        archetype: 'Mage',
        faction: 'Oceanic Alliance',
        race: 'Merfolk',
        level: 8,
        category: 'Hero',
        epicPoints: 40,
        type: 'Magic',
        isNPC: false,
        isVisible: true,
        playerId: createdPlayers[1].id,
      },
      {
        characterName: 'Pearl Scout',
        archetype: 'Rogue',
        faction: 'Oceanic Alliance',
        race: 'Merfolk',
        level: 6,
        category: 'Hero',
        epicPoints: 30,
        type: 'Stealth',
        isNPC: false,
        isVisible: true,
        playerId: createdPlayers[2].id,
      },
    ];

    const createdCharacters = [];
    for (const characterData of characters) {
      const character = await prisma.character.create({ data: characterData });
      createdCharacters.push(character);
      console.log(`✅ Created character: ${character.characterName}`);
    }

    // Create attributes for characters
    const attributes = [
      {
        characterId: createdCharacters[0].id,
        strength: 15,
        agility: 10,
        willpower: 12,
        luck: 8,
        intelligence: 10,
      },
      {
        characterId: createdCharacters[1].id,
        strength: 8,
        agility: 12,
        willpower: 15,
        luck: 10,
        intelligence: 18,
      },
      {
        characterId: createdCharacters[2].id,
        strength: 10,
        agility: 15,
        willpower: 10,
        luck: 12,
        intelligence: 12,
      },
    ];

    for (const attributeData of attributes) {
      const attribute = await prisma.attribute.create({ data: attributeData });
      console.log(
        `✅ Created attributes for character ID: ${attribute.characterId}`
      );
    }

    // Create domains for characters
    const domains = [
      {
        characterId: createdCharacters[0].id,
        physical: 20,
        combat: 25,
        social: 10,
        environmental: 15,
        stealth: 8,
        knowledge: 12,
        technical: 10,
        resources: 5,
        demonic: 0,
        aura: 18,
      },
      {
        characterId: createdCharacters[1].id,
        physical: 10,
        combat: 15,
        social: 12,
        environmental: 18,
        stealth: 10,
        knowledge: 25,
        technical: 8,
        resources: 5,
        demonic: 0,
        aura: 20,
      },
      {
        characterId: createdCharacters[2].id,
        physical: 12,
        combat: 18,
        social: 15,
        environmental: 20,
        stealth: 25,
        knowledge: 10,
        technical: 8,
        resources: 5,
        demonic: 0,
        aura: 15,
      },
    ];

    for (const domainData of domains) {
      const domain = await prisma.domain.create({ data: domainData });
      console.log(`✅ Created domains for character ID: ${domain.characterId}`);
    }

    // Create combat stats for characters
    const combatStats = [
      {
        characterId: createdCharacters[0].id,
        physicalHealth: 100,
        maxPhysicalHealth: 100,
        physicalResistance: 50,
        maxPhysicalResistance: 50,
        mentalHealth: 80,
        maxMentalHealth: 80,
        mentalResistance: 40,
        maxMentalResistance: 40,
        initiative: 20,
        defense: 30,
        attack: 40,
        impact: 25,
        maxDamage: 50,
      },
      {
        characterId: createdCharacters[1].id,
        physicalHealth: 80,
        maxPhysicalHealth: 80,
        physicalResistance: 40,
        maxPhysicalResistance: 40,
        mentalHealth: 100,
        maxMentalHealth: 100,
        mentalResistance: 50,
        maxMentalResistance: 50,
        initiative: 15,
        defense: 25,
        attack: 30,
        impact: 20,
        maxDamage: 40,
      },
      {
        characterId: createdCharacters[2].id,
        physicalHealth: 90,
        maxPhysicalHealth: 90,
        physicalResistance: 45,
        maxPhysicalResistance: 45,
        mentalHealth: 70,
        maxMentalHealth: 70,
        mentalResistance: 35,
        maxMentalResistance: 35,
        initiative: 25,
        defense: 20,
        attack: 35,
        impact: 30,
        maxDamage: 45,
      },
    ];

    for (const combatStatData of combatStats) {
      const combatStat = await prisma.combatStats.create({
        data: combatStatData,
      });
      console.log(
        `✅ Created combat stats for character ID: ${combatStat.characterId}`
      );
    }

    // Create narratives for characters
    const narratives = [
      {
        characterId: createdCharacters[0].id,
        physicalDescription: 'Tall and armored',
        externalProfile: 'Brave and loyal',
        internalProfile: 'Determined and strategic',
        background: 'A knight from the deep seas',
        specialties: 'Swordsmanship and leadership',
      },
      {
        characterId: createdCharacters[1].id,
        physicalDescription: 'Slim and mystical',
        externalProfile: 'Wise and calm',
        internalProfile: 'Intelligent and curious',
        background: 'A mage who studies coral magic',
        specialties: 'Spellcasting and enchantments',
      },
      {
        characterId: createdCharacters[2].id,
        physicalDescription: 'Agile and stealthy',
        externalProfile: 'Cunning and resourceful',
        internalProfile: 'Quick-thinking and adaptive',
        background: 'A scout who explores the ocean floor',
        specialties: 'Stealth and reconnaissance',
      },
    ];

    for (const narrativeData of narratives) {
      const narrative = await prisma.narrative.create({ data: narrativeData });
      console.log(
        `✅ Created narrative for character ID: ${narrative.characterId}`
      );
    }

    console.log('🎉 Database seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
