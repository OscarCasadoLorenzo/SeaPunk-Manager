import { z } from 'zod';

// Stats form validation schema
export const statsFormSchema = z.object({
  // Basic character info
  playerName: z.string().optional(), // Read-only field, not editable
  characterName: z.string().min(1, 'Character name is required'),
  archetype: z.string().min(1, 'Archetype is required'),
  faction: z.string().min(1, 'Faction is required'),
  race: z.string().min(1, 'Race is required'),
  category: z.string().optional(),
  level: z.number().min(1, 'Level must be at least 1'),
  epicPoints: z.number().min(0, 'Epic points cannot be negative'),

  // Attributes
  strength: z.number().min(1, 'Strength must be at least 1'),
  agility: z.number().min(1, 'Agility must be at least 1'),
  willpower: z.number().min(1, 'Willpower must be at least 1'),
  luck: z.number().min(1, 'Luck must be at least 1'),
  intelligence: z.number().min(1, 'Intelligence must be at least 1'),

  // Domains
  physical: z.number().min(0, 'Physical cannot be negative'),
  combat: z.number().min(0, 'Combat cannot be negative'),
  social: z.number().min(0, 'Social cannot be negative'),
  environmental: z.number().min(0, 'Environmental cannot be negative'),
  stealth: z.number().min(0, 'Stealth cannot be negative'),
  knowledge: z.number().min(0, 'Knowledge cannot be negative'),
  technical: z.number().min(0, 'Technical cannot be negative'),
  resources: z.number().min(0, 'Resources cannot be negative'),
  demonic: z.number().min(0, 'Demonic cannot be negative'),
  aura: z.number().min(0, 'Aura cannot be negative'),

  // Combat Stats
  physicalHealth: z.number().min(0, 'Physical health cannot be negative'),
  maxPhysicalHealth: z
    .number()
    .min(1, 'Max physical health must be at least 1'),
  physicalResistance: z
    .number()
    .min(0, 'Physical resistance cannot be negative'),
  maxPhysicalResistance: z
    .number()
    .min(1, 'Max physical resistance must be at least 1'),
  mentalHealth: z.number().min(0, 'Mental health cannot be negative'),
  maxMentalHealth: z.number().min(1, 'Max mental health must be at least 1'),
  mentalResistance: z.number().min(0, 'Mental resistance cannot be negative'),
  maxMentalResistance: z
    .number()
    .min(1, 'Max mental resistance must be at least 1'),
  initiative: z.number().min(0, 'Initiative cannot be negative'),
  defense: z.number().min(0, 'Defense cannot be negative'),
  attack: z.number().min(0, 'Attack cannot be negative'),
  impact: z.number().min(0, 'Impact cannot be negative'),
  maxDamage: z.number().min(0, 'Max damage cannot be negative'),
});

export type StatsFormData = z.infer<typeof statsFormSchema>;
