import { z } from 'zod';

// Stats form validation schema (Basic info + Attributes + Domains + Combat Stats)
export const statsFormSchema = z.object({
  // Basic character info
  playerName: z.string().min(1, 'Player name is required'),
  characterName: z.string().min(1, 'Character name is required'),
  archetype: z.string().min(1, 'Archetype is required'),
  faction: z.string().min(1, 'Faction is required'),
  race: z.string().min(1, 'Race is required'),
  category: z.string().min(1, 'Category is required'),
  level: z
    .number()
    .min(1, 'Level must be at least 1')
    .max(20, 'Level cannot exceed 20'),
  epicPoints: z.number().min(0, 'Epic points cannot be negative'),

  // Attributes
  strength: z
    .number()
    .min(1, 'Strength must be at least 1')
    .max(100, 'Strength cannot exceed 100'),
  agility: z
    .number()
    .min(1, 'Agility must be at least 1')
    .max(100, 'Agility cannot exceed 100'),
  willpower: z
    .number()
    .min(1, 'Willpower must be at least 1')
    .max(100, 'Willpower cannot exceed 100'),
  luck: z
    .number()
    .min(1, 'Luck must be at least 1')
    .max(100, 'Luck cannot exceed 100'),
  intelligence: z
    .number()
    .min(1, 'Intelligence must be at least 1')
    .max(100, 'Intelligence cannot exceed 100'),

  // Domains
  physical: z
    .number()
    .min(0, 'Physical domain cannot be negative')
    .max(100, 'Physical domain cannot exceed 100'),
  combat: z
    .number()
    .min(0, 'Combat domain cannot be negative')
    .max(100, 'Combat domain cannot exceed 100'),
  social: z
    .number()
    .min(0, 'Social domain cannot be negative')
    .max(100, 'Social domain cannot exceed 100'),
  environmental: z
    .number()
    .min(0, 'Environmental domain cannot be negative')
    .max(100, 'Environmental domain cannot exceed 100'),
  stealth: z
    .number()
    .min(0, 'Stealth domain cannot be negative')
    .max(100, 'Stealth domain cannot exceed 100'),
  knowledge: z
    .number()
    .min(0, 'Knowledge domain cannot be negative')
    .max(100, 'Knowledge domain cannot exceed 100'),
  technical: z
    .number()
    .min(0, 'Technical domain cannot be negative')
    .max(100, 'Technical domain cannot exceed 100'),
  resources: z
    .number()
    .min(0, 'Resources domain cannot be negative')
    .max(100, 'Resources domain cannot exceed 100'),
  demonic: z
    .number()
    .min(0, 'Demonic domain cannot be negative')
    .max(100, 'Demonic domain cannot exceed 100'),
  aura: z
    .number()
    .min(0, 'Aura domain cannot be negative')
    .max(100, 'Aura domain cannot exceed 100'),

  // Combat Stats
  physicalHealth: z.number().min(1, 'Physical health must be at least 1'),
  maxPhysicalHealth: z
    .number()
    .min(1, 'Max physical health must be at least 1'),
  physicalResistance: z
    .number()
    .min(0, 'Physical resistance cannot be negative'),
  maxPhysicalResistance: z
    .number()
    .min(0, 'Max physical resistance cannot be negative'),
  mentalHealth: z.number().min(1, 'Mental health must be at least 1'),
  maxMentalHealth: z.number().min(1, 'Max mental health must be at least 1'),
  mentalResistance: z.number().min(0, 'Mental resistance cannot be negative'),
  maxMentalResistance: z
    .number()
    .min(0, 'Max mental resistance cannot be negative'),
  initiative: z.number().min(0, 'Initiative cannot be negative'),
  defense: z.number().min(0, 'Defense cannot be negative'),
  attack: z.number().min(0, 'Attack cannot be negative'),
  impact: z.number().min(0, 'Impact cannot be negative'),
  maxDamage: z.number().min(0, 'Max damage cannot be negative'),
});

export type StatsFormData = z.infer<typeof statsFormSchema>;
