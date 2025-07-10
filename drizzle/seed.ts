import { db } from './index';
import * as schema from './schema';

async function seed() {
  console.log('Seeding database...');

  try {
    // Insert sample characters
    const sampleCharacters = await db
      .insert(schema.characters)
      .values([
        {
          name: 'Aria Stormwind',
          description: 'A skilled warrior with mastery over wind magic',
          level: 5,
        },
        {
          name: 'Kael Shadowbane',
          description: 'A mysterious assassin from the shadow realm',
          level: 3,
        },
        {
          name: 'Luna Brightforge',
          description: 'A talented blacksmith with divine blessing',
          level: 4,
        },
      ])
      .returning();

    console.log('Sample characters created:', sampleCharacters);

    // Insert sample attributes for the first character
    if (sampleCharacters[0]) {
      const sampleAttributes = await db
        .insert(schema.attributes)
        .values({
          characterId: sampleCharacters[0].id,
          strength: 15,
          dexterity: 12,
          intelligence: 14,
          constitution: 13,
          wisdom: 11,
          charisma: 16,
        })
        .returning();

      console.log('Sample attributes created:', sampleAttributes);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

if (require.main === module) {
  seed().then(() => process.exit(0));
}

export default seed;
