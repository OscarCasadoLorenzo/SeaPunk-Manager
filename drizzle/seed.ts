import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { reset, seed } from 'drizzle-seed';
import * as schema from './schema';

async function main() {
  const db = drizzle(process.env.DATABASE_URL!);
  await reset(db, schema);
  await seed(db, schema).refine((f) => ({
    players: {
      count: 2,
      columns: {
        // IDs autoincrement, so omit or use null
        playerName: f.valuesFromArray({ values: ['Alice', 'Bob'] }),
      },
    },
    characters: {
      count: 3,
      columns: {
        // IDs autoincrement, so omit or use null
        characterName: f.valuesFromArray({
          values: ['Eldor', 'Ragnar', 'Shadowfox'],
        }),
        archetype: f.valuesFromArray({
          values: ['Wizard', 'Warrior', 'Rogue'],
        }),
        faction: f.valuesFromArray({
          values: ['Circle of Mages', 'Barbarians', 'Thieves Guild'],
        }),
        race: f.valuesFromArray({ values: ['Elf', 'Orc', 'Human'] }),
        level: f.valuesFromArray({ values: [10, 1, 5] }),
        category: f.valuesFromArray({
          values: ['Legendary', 'Common', 'Elite'],
        }),
        epicPoints: f.valuesFromArray({ values: [100, 0, 50] }),
        type: f.valuesFromArray({ values: ['Magic', 'Melee', 'Stealth'] }),
        isNPC: f.valuesFromArray({ values: [false, true, false] }),
        isVisible: f.valuesFromArray({ values: [true, false, true] }),
        playerId: f.valuesFromArray({ values: [1, 2, 1] }), // FK to players
      },
      with: {
        attributes: 1,
        domains: 1,
        combatStats: 1,
        narrative: 1,
        inventory: 2,
        effect: 2,
        essence: 1,
        auraGift: 1,
      },
    },
    attributes: {
      columns: {
        strength: f.valuesFromArray({ values: [5, 20, 10] }),
        agility: f.valuesFromArray({ values: [8, 5, 15] }),
        willpower: f.valuesFromArray({ values: [20, 0, 10] }),
        luck: f.valuesFromArray({ values: [1, 0, 10] }),
        intelligence: f.valuesFromArray({ values: [30, 1, 10] }),
      },
    },
    domains: {
      columns: {
        physical: f.valuesFromArray({ values: [1, 100, 10] }),
        combat: f.valuesFromArray({ values: [1, 100, 20] }),
        social: f.valuesFromArray({ values: [1, 0, 30] }),
        environmental: f.valuesFromArray({ values: [1, 0, 40] }),
        stealth: f.valuesFromArray({ values: [1, 0, 50] }),
        knowledge: f.valuesFromArray({ values: [100, 0, 60] }),
        technical: f.valuesFromArray({ values: [100, 0, 70] }),
        resources: f.valuesFromArray({ values: [50, 0, 80] }),
        demonic: f.valuesFromArray({ values: [0, 0, 90] }),
        aura: f.valuesFromArray({ values: [100, 0, 100] }),
      },
    },
    combatStats: {
      columns: {
        physicalHealth: f.valuesFromArray({ values: [100, 0, 50] }),
        maxPhysicalHealth: f.valuesFromArray({ values: [100, 10, 50] }),
        physicalResistance: f.valuesFromArray({ values: [25, 1, 10] }),
        maxPhysicalResistance: f.valuesFromArray({ values: [30, 1, 10] }),
        mentalHealth: f.valuesFromArray({ values: [200, 0, 50] }),
        maxMentalHealth: f.valuesFromArray({ values: [200, 10, 50] }),
        mentalResistance: f.valuesFromArray({ values: [50, 0, 5] }),
        maxMentalResistance: f.valuesFromArray({ values: [50, 1, 5] }),
        initiative: f.valuesFromArray({ values: [10, -5, 20] }),
        defense: f.valuesFromArray({ values: [5, 0, 15] }),
        attack: f.valuesFromArray({ values: [100, 5, 15] }),
        impact: f.valuesFromArray({ values: [100, 1, 10] }),
        maxDamage: f.valuesFromArray({ values: [500, 10, 25] }),
      },
    },
    narrative: {
      columns: {
        physicalDescription: f.valuesFromArray({
          values: ['Tall elf with runes.', 'Big orc.', 'Slim, hooded.'],
        }),
        externalProfile: f.valuesFromArray({
          values: ['Scholar', 'Brute', 'Thief'],
        }),
        internalProfile: f.valuesFromArray({
          values: ['Wise', 'Angry', 'Clever'],
        }),
        background: f.valuesFromArray({
          values: ['Mage War survivor', 'Born wild', 'Raised in streets'],
        }),
        specialties: f.valuesFromArray({
          values: ['Arcane, diplomacy', 'Breaking things', 'Lockpicking'],
        }),
      },
    },
    inventory: {
      count: 2,
      columns: {
        // id is serial, omit
        name: f.valuesFromArray({
          values: ['Staff of Eternity', 'Lockpick Set'],
        }),
        description: f.valuesFromArray({
          values: ['A magical staff.', 'Useful for doors.'],
        }),
        quantity: f.valuesFromArray({ values: [1, 10] }),
        type: f.valuesFromArray({ values: ['Magic', 'Tool'] }),
      },
    },
    effect: {
      count: 2,
      columns: {
        // id is serial, omit
        name: f.valuesFromArray({ values: ['Arcane Shield', 'Poisoned'] }),
        duration: f.valuesFromArray({ values: [5, 3] }),
        type: f.valuesFromArray({ values: ['Buff', 'Debuff'] }),
        description: f.valuesFromArray({
          values: ['Reduces damage.', 'Takes damage.'],
        }),
      },
    },
    essence: {
      columns: {
        name: f.valuesFromArray({
          values: ['Ethereal Memory', 'Night Vision', 'Fire Soul'],
        }),
      },
    },
    auraGift: {
      columns: {
        name: f.valuesFromArray({
          values: ['True Sight', 'Shadow Step', 'Berserk'],
        }),
      },
    },
  }));
  console.log('🌱 drizzle-seed completed!');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
