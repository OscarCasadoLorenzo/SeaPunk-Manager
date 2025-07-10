import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// Characters table
export const characters = pgTable('characters', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  level: integer('level').default(1),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Attributes table
export const attributes = pgTable('attributes', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id),
  strength: integer('strength').default(0),
  dexterity: integer('dexterity').default(0),
  intelligence: integer('intelligence').default(0),
  constitution: integer('constitution').default(0),
  wisdom: integer('wisdom').default(0),
  charisma: integer('charisma').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Aura Gifts table
export const auraGift = pgTable('aura_gifts', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type'),
  level: integer('level').default(1),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Combat Stats table
export const combatStats = pgTable('combat_stats', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id),
  health: integer('health').default(100),
  maxHealth: integer('max_health').default(100),
  armor: integer('armor').default(0),
  speed: integer('speed').default(5),
  initiative: integer('initiative').default(0),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Domains table
export const domains = pgTable('domains', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type'),
  level: integer('level').default(1),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Effects table
export const effects = pgTable('effects', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id),
  name: text('name').notNull(),
  description: text('description'),
  type: text('type'),
  duration: integer('duration').default(0),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Essence table
export const essence = pgTable('essence', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id),
  current: integer('current').default(0),
  maximum: integer('maximum').default(100),
  type: text('type'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Inventory table
export const inventory = pgTable('inventory', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id),
  itemName: text('item_name').notNull(),
  description: text('description'),
  quantity: integer('quantity').default(1),
  type: text('type'),
  rarity: text('rarity'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Narrative table
export const narrative = pgTable('narrative', {
  id: serial('id').primaryKey(),
  characterId: integer('character_id').references(() => characters.id),
  title: text('title').notNull(),
  content: text('content'),
  type: text('type'),
  isCompleted: boolean('is_completed').default(false),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Players table
export const players = pgTable('players', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  characterId: integer('character_id').references(() => characters.id),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
