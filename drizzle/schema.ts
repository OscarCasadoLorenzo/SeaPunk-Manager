import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// Players table
export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  playerName: text('player_name').notNull(),
});

// Characters table
export const characters = pgTable('characters', {
  id: serial('id').primaryKey(),
  characterName: text('character_name').notNull(),
  archetype: text('archetype'),
  faction: text('faction'),
  race: text('race'),
  level: integer('level').notNull(),
  category: text('category'),
  epicPoints: integer('epic_points'),
  type: text('type'),
  isNPC: boolean('is_npc').notNull().default(false),
  isVisible: boolean('is_visible').notNull().default(true),
  playerId: integer('player_id').references(() => players.id),
  createdAt: timestamp('created_at').defaultNow(),
});

// Attributes table
export const attributes = pgTable('attributes', {
  characterId: integer('character_id').references(() => characters.id),
  strength: integer('strength'),
  agility: integer('agility'),
  willpower: integer('willpower'),
  luck: integer('luck'),
  intelligence: integer('intelligence'),
});

// Domains table
export const domains = pgTable('domains', {
  characterId: integer('character_id').references(() => characters.id),
  physical: integer('physical'),
  combat: integer('combat'),
  social: integer('social'),
  environmental: integer('environmental'),
  stealth: integer('stealth'),
  knowledge: integer('knowledge'),
  technical: integer('technical'),
  resources: integer('resources'),
  demonic: integer('demonic'),
  aura: integer('aura'),
});

// Combat Stats table
export const combatStats = pgTable('combat_stats', {
  characterId: integer('character_id').references(() => characters.id),
  physicalHealth: integer('physical_health'),
  maxPhysicalHealth: integer('max_physical_health'),
  physicalResistance: integer('physical_resistance'),
  maxPhysicalResistance: integer('max_physical_resistance'),
  mentalHealth: integer('mental_health'),
  maxMentalHealth: integer('max_mental_health'),
  mentalResistance: integer('mental_resistance'),
  maxMentalResistance: integer('max_mental_resistance'),
  initiative: integer('initiative'),
  defense: integer('defense'),
  attack: integer('attack'),
  impact: integer('impact'),
  maxDamage: integer('max_damage'),
});

// Narrative table
export const narrative = pgTable('narrative', {
  characterId: integer('character_id').references(() => characters.id),
  physicalDescription: text('physical_description'),
  externalProfile: text('external_profile'),
  internalProfile: text('internal_profile'),
  background: text('background'),
  specialties: text('specialties'),
});

// Inventory table
export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id),
  name: text('name'),
  description: text('description'),
  quantity: integer('quantity'),
  type: text('type'),
});

// Effect table
export const effect = pgTable('effect', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id),
  name: text('name'),
  duration: integer('duration'),
  type: text('type'),
  description: text('description'),
});

// Essence table
export const essence = pgTable('essence', {
  characterId: integer('character_id').references(() => characters.id),
  name: text('name'),
});

// Aura Gift table
export const auraGift = pgTable('aura_gift', {
  characterId: integer('character_id').references(() => characters.id),
  name: text('name'),
});
