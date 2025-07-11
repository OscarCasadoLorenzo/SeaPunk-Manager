import {
  createField,
  createFormConfig,
  createSection,
} from '@/utils/form-builder';
import { z } from 'zod';

// Simplified character creation validation schema
export const createCharacterFormSchema = z
  .object({
    // Basic character info
    playerName: z.string().optional(), // Optional for NPCs
    characterName: z.string().min(1, 'Character name is required'),
    archetype: z.string().min(1, 'Archetype is required'),
    faction: z.string().min(1, 'Faction is required'),
    race: z.string().min(1, 'Race is required'),
    category: z.string().min(1, 'Category is required'),
    level: z.coerce
      .number()
      .min(1, 'Level must be at least 1')
      .max(20, 'Level cannot exceed 20'),
    epicPoints: z.coerce.number().min(0, 'Epic points cannot be negative'),
    isNPC: z.boolean().default(true),
  })
  .refine(
    (data) => {
      // If it's not an NPC, player name is required
      if (!data.isNPC && (!data.playerName || data.playerName.trim() === '')) {
        return false;
      }
      return true;
    },
    {
      message: 'Player name is required for non-NPC characters',
      path: ['playerName'],
    }
  );

export type CreateCharacterFormData = z.infer<typeof createCharacterFormSchema>;

// Simplified character creation form configuration
export const createCharacterFormConfig = createFormConfig({
  title: 'Crear Nuevo Personaje',
  description: 'Completa la información básica del personaje',
  sections: [
    createSection({
      title: 'Información Básica',
      columns: 2,
      fields: [
        createField('checkbox', {
          name: 'isNPC',
          label: 'Es NPC',
          description: 'Marca si es un personaje no jugador',
        }),
        createField('select', {
          name: 'playerName',
          label: 'Jugador Asociado',
          placeholder: 'Selecciona un jugador',
          required: false, // Will be conditionally required
          options: [], // Will be populated dynamically
          disabled: true, // Initially disabled when NPC is true
        }),
        createField('text', {
          name: 'characterName',
          label: 'Nombre del personaje',
          placeholder: 'Introduce el nombre del personaje',
          required: true,
        }),
        createField('text', {
          name: 'archetype',
          label: 'Arquetipo',
          placeholder: 'Ej: Guerrero, Mago, Pícaro...',
          required: true,
        }),
        createField('text', {
          name: 'faction',
          label: 'Facción',
          placeholder: 'Facción del personaje',
          required: true,
        }),
        createField('text', {
          name: 'race',
          label: 'Raza',
          placeholder: 'Raza del personaje',
          required: true,
        }),
        createField('text', {
          name: 'category',
          label: 'Categoría',
          placeholder: 'Categoría del personaje',
          required: true,
        }),
        createField('number', {
          name: 'level',
          label: 'Nivel',
          placeholder: '1',
          required: true,
          min: 1,
          max: 20,
        }),
        createField('number', {
          name: 'epicPoints',
          label: 'Puntos Épicos',
          placeholder: '0',
          required: true,
          min: 0,
        }),
      ],
    }),
  ],
  submitButton: {
    text: 'Crear Personaje',
    className: 'bg-green-600 hover:bg-green-700',
  },
});
