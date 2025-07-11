import {
  createField,
  createFormConfig,
  createSection,
} from '@/utils/form-builder';
import { z } from 'zod';

// Character form validation schema
export const characterFormSchema = z.object({
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
  physicalDescription: z.string().optional(),

  // Attributes
  strength: z
    .number()
    .min(1, 'Strength must be at least 1')
    .max(10, 'Strength cannot exceed 10'),
  agility: z
    .number()
    .min(1, 'Agility must be at least 1')
    .max(10, 'Agility cannot exceed 10'),
  willpower: z
    .number()
    .min(1, 'Willpower must be at least 1')
    .max(10, 'Willpower cannot exceed 10'),
  luck: z
    .number()
    .min(1, 'Luck must be at least 1')
    .max(10, 'Luck cannot exceed 10'),
  intelligence: z
    .number()
    .min(1, 'Intelligence must be at least 1')
    .max(10, 'Intelligence cannot exceed 10'),

  // Domains
  physical: z
    .number()
    .min(0, 'Physical domain cannot be negative')
    .max(10, 'Physical domain cannot exceed 10'),
  combat: z
    .number()
    .min(0, 'Combat domain cannot be negative')
    .max(10, 'Combat domain cannot exceed 10'),
  social: z
    .number()
    .min(0, 'Social domain cannot be negative')
    .max(10, 'Social domain cannot exceed 10'),
  environmental: z
    .number()
    .min(0, 'Environmental domain cannot be negative')
    .max(10, 'Environmental domain cannot exceed 10'),
  stealth: z
    .number()
    .min(0, 'Stealth domain cannot be negative')
    .max(10, 'Stealth domain cannot exceed 10'),
  knowledge: z
    .number()
    .min(0, 'Knowledge domain cannot be negative')
    .max(10, 'Knowledge domain cannot exceed 10'),
  technical: z
    .number()
    .min(0, 'Technical domain cannot be negative')
    .max(10, 'Technical domain cannot exceed 10'),
  resources: z
    .number()
    .min(0, 'Resources domain cannot be negative')
    .max(10, 'Resources domain cannot exceed 10'),
  demonic: z
    .number()
    .min(0, 'Demonic domain cannot be negative')
    .max(10, 'Demonic domain cannot exceed 10'),
  aura: z
    .number()
    .min(0, 'Aura domain cannot be negative')
    .max(10, 'Aura domain cannot exceed 10'),

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

  // Narrative fields
  externalProfile: z.string().optional(),
  internalProfile: z.string().optional(),
  background: z.string().optional(),
  specialties: z.string().optional(),
});

export type CharacterFormData = z.infer<typeof characterFormSchema>;

// Character form configuration
export const characterFormConfig = createFormConfig({
  title: 'Ficha de Personaje',
  description: 'Edita la información del personaje',
  sections: [
    createSection({
      title: 'Información Básica',
      columns: 2,
      fields: [
        createField('text', {
          name: 'playerName',
          label: 'Nombre del jugador',
          placeholder: 'Introduce el nombre del jugador',
          required: true,
          validation: z.string().min(1, 'Player name is required'),
        }),
        createField('text', {
          name: 'characterName',
          label: 'Nombre del personaje',
          placeholder: 'Introduce el nombre del personaje',
          required: true,
          validation: z.string().min(1, 'Character name is required'),
        }),
        createField('text', {
          name: 'archetype',
          label: 'Arquetipo',
          placeholder: 'Arquetipo del personaje',
          required: true,
          validation: z.string().min(1, 'Archetype is required'),
        }),
        createField('text', {
          name: 'faction',
          label: 'Facción',
          placeholder: 'Facción del personaje',
          required: true,
          validation: z.string().min(1, 'Faction is required'),
        }),
        createField('text', {
          name: 'race',
          label: 'Raza',
          placeholder: 'Raza del personaje',
          required: true,
          validation: z.string().min(1, 'Race is required'),
        }),
        createField('text', {
          name: 'category',
          label: 'Categoría',
          placeholder: 'Categoría del personaje',
          required: true,
          validation: z.string().min(1, 'Category is required'),
        }),
        createField('number', {
          name: 'level',
          label: 'Nivel',
          placeholder: '1',
          required: true,
          min: 1,
          max: 20,
          validation: z.number().min(1).max(20),
        }),
        createField('number', {
          name: 'epicPoints',
          label: 'Puntos de Épica (PÉP)',
          placeholder: '0',
          required: true,
          min: 0,
          validation: z.number().min(0),
        }),
      ],
    }),
    createSection({
      title: 'Atributos',
      description: 'Valores de 1 a 10',
      columns: 3,
      fields: [
        createField('number', {
          name: 'strength',
          label: 'Fuerza (FUE)',
          required: true,
          min: 1,
          max: 10,
          defaultValue: 1,
        }),
        createField('number', {
          name: 'agility',
          label: 'Agilidad (DIN)',
          required: true,
          min: 1,
          max: 10,
          defaultValue: 1,
        }),
        createField('number', {
          name: 'willpower',
          label: 'Voluntad (VOL)',
          required: true,
          min: 1,
          max: 10,
          defaultValue: 1,
        }),
        createField('number', {
          name: 'luck',
          label: 'Suerte (SUR)',
          required: true,
          min: 1,
          max: 10,
          defaultValue: 1,
        }),
        createField('number', {
          name: 'intelligence',
          label: 'Inteligencia (INT)',
          required: true,
          min: 1,
          max: 10,
          defaultValue: 1,
        }),
      ],
    }),
    createSection({
      title: 'Dominios',
      description: 'Valores de 0 a 10',
      columns: 2,
      fields: [
        createField('number', {
          name: 'physical',
          label: 'Físico',
          min: 0,
          max: 10,
          defaultValue: 0,
        }),
        createField('number', {
          name: 'combat',
          label: 'Batalla',
          min: 0,
          max: 10,
          defaultValue: 0,
        }),
        createField('number', {
          name: 'social',
          label: 'Social',
          min: 0,
          max: 10,
          defaultValue: 0,
        }),
        createField('number', {
          name: 'environmental',
          label: 'Ambiental',
          min: 0,
          max: 10,
          defaultValue: 0,
        }),
        createField('number', {
          name: 'stealth',
          label: 'Sigilo',
          min: 0,
          max: 10,
          defaultValue: 0,
        }),
        createField('number', {
          name: 'knowledge',
          label: 'Conocimiento',
          min: 0,
          max: 10,
          defaultValue: 0,
        }),
        createField('number', {
          name: 'technical',
          label: 'Técnico',
          min: 0,
          max: 10,
          defaultValue: 0,
        }),
        createField('number', {
          name: 'resources',
          label: 'Recursos',
          min: 0,
          max: 10,
          defaultValue: 0,
        }),
        createField('number', {
          name: 'demonic',
          label: 'Demoníaco',
          min: 0,
          max: 10,
          defaultValue: 0,
        }),
        createField('number', {
          name: 'aura',
          label: 'Aura',
          min: 0,
          max: 10,
          defaultValue: 0,
        }),
      ],
    }),
    createSection({
      title: 'Parámetros de Combate',
      columns: 2,
      fields: [
        createField('number', {
          name: 'physicalHealth',
          label: 'Salud física actual',
          required: true,
          min: 0,
          defaultValue: 10,
        }),
        createField('number', {
          name: 'maxPhysicalHealth',
          label: 'Salud física máxima',
          required: true,
          min: 1,
          defaultValue: 10,
        }),
        createField('number', {
          name: 'physicalResistance',
          label: 'Resistencia física actual',
          required: true,
          min: 0,
          defaultValue: 10,
        }),
        createField('number', {
          name: 'maxPhysicalResistance',
          label: 'Resistencia física máxima',
          required: true,
          min: 0,
          defaultValue: 10,
        }),
        createField('number', {
          name: 'mentalHealth',
          label: 'Salud mental actual',
          required: true,
          min: 0,
          defaultValue: 10,
        }),
        createField('number', {
          name: 'maxMentalHealth',
          label: 'Salud mental máxima',
          required: true,
          min: 1,
          defaultValue: 10,
        }),
        createField('number', {
          name: 'mentalResistance',
          label: 'Resistencia mental actual',
          required: true,
          min: 0,
          defaultValue: 10,
        }),
        createField('number', {
          name: 'maxMentalResistance',
          label: 'Resistencia mental máxima',
          required: true,
          min: 0,
          defaultValue: 10,
        }),
        createField('number', {
          name: 'initiative',
          label: 'Iniciativa',
          min: 0,
          defaultValue: 0,
        }),
        createField('number', {
          name: 'defense',
          label: 'Defensa',
          min: 0,
          defaultValue: 0,
        }),
        createField('number', {
          name: 'attack',
          label: 'Ataque',
          min: 0,
          defaultValue: 0,
        }),
        createField('number', {
          name: 'impact',
          label: 'Impacto',
          min: 0,
          defaultValue: 0,
        }),
        createField('number', {
          name: 'maxDamage',
          label: 'Daño máximo',
          min: 0,
          defaultValue: 0,
        }),
      ],
    }),
    createSection({
      title: 'Información Narrativa',
      columns: 1,
      fields: [
        createField('textarea', {
          name: 'physicalDescription',
          label: 'Descripción física',
          placeholder: 'Describe la apariencia física del personaje...',
          rows: 3,
        }),
        createField('textarea', {
          name: 'externalProfile',
          label: 'Perfil externo',
          placeholder: 'Cómo actúa y se presenta el personaje ante otros...',
          rows: 4,
        }),
        createField('textarea', {
          name: 'internalProfile',
          label: 'Perfil interno',
          placeholder:
            'Los pensamientos, motivaciones y personalidad interna...',
          rows: 4,
        }),
        createField('textarea', {
          name: 'background',
          label: 'Trasfondo',
          placeholder: 'Historia personal y eventos importantes...',
          rows: 5,
        }),
        createField('textarea', {
          name: 'specialties',
          label: 'Especialidades y poderes',
          placeholder: 'Habilidades especiales, poderes únicos...',
          rows: 4,
        }),
      ],
    }),
  ],
  submitButton: {
    text: 'Guardar Cambios',
    className: 'bg-blue-600 hover:bg-blue-700',
  },
  cancelButton: {
    text: 'Cancelar',
  },
});
