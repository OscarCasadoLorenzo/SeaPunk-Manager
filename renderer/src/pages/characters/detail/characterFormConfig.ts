import {
  createField,
  createFormConfig,
  createSection,
  createTab,
} from '@/utils/form-builder';
import { z } from 'zod';

// Character form validation schema
export const characterFormSchema = z
  .object({
    // Basic character info
    playerName: z.string().min(1, 'Player name is required'),
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
    physicalDescription: z.string().optional(),

    // Attributes
    strength: z.coerce
      .number()
      .min(1, 'Strength must be at least 1')
      .max(100, 'Strength cannot exceed 100'),
    agility: z.coerce
      .number()
      .min(1, 'Agility must be at least 1')
      .max(100, 'Agility cannot exceed 100'),
    willpower: z.coerce
      .number()
      .min(1, 'Willpower must be at least 1')
      .max(100, 'Willpower cannot exceed 100'),
    luck: z.coerce
      .number()
      .min(1, 'Luck must be at least 1')
      .max(100, 'Luck cannot exceed 100'),
    intelligence: z.coerce
      .number()
      .min(1, 'Intelligence must be at least 1')
      .max(100, 'Intelligence cannot exceed 100'),

    // Domains
    physical: z.coerce
      .number()
      .min(0, 'Physical domain cannot be negative')
      .max(100, 'Physical domain cannot exceed 100'),
    combat: z.coerce
      .number()
      .min(0, 'Combat domain cannot be negative')
      .max(100, 'Combat domain cannot exceed 100'),
    social: z.coerce
      .number()
      .min(0, 'Social domain cannot be negative')
      .max(100, 'Social domain cannot exceed 100'),
    environmental: z.coerce
      .number()
      .min(0, 'Environmental domain cannot be negative')
      .max(100, 'Environmental domain cannot exceed 100'),
    stealth: z.coerce
      .number()
      .min(0, 'Stealth domain cannot be negative')
      .max(100, 'Stealth domain cannot exceed 100'),
    knowledge: z.coerce
      .number()
      .min(0, 'Knowledge domain cannot be negative')
      .max(100, 'Knowledge domain cannot exceed 100'),
    technical: z.coerce
      .number()
      .min(0, 'Technical domain cannot be negative')
      .max(100, 'Technical domain cannot exceed 100'),
    resources: z.coerce
      .number()
      .min(0, 'Resources domain cannot be negative')
      .max(100, 'Resources domain cannot exceed 100'),
    demonic: z.coerce
      .number()
      .min(0, 'Demonic domain cannot be negative')
      .max(100, 'Demonic domain cannot exceed 100'),
    aura: z.coerce
      .number()
      .min(0, 'Aura domain cannot be negative')
      .max(100, 'Aura domain cannot exceed 100'),

    // Combat Stats
    physicalHealth: z.coerce
      .number()
      .min(1, 'Physical health must be at least 1'),
    maxPhysicalHealth: z.coerce
      .number()
      .min(1, 'Max physical health must be at least 1'),
    physicalResistance: z.coerce
      .number()
      .min(0, 'Physical resistance cannot be negative'),
    maxPhysicalResistance: z.coerce
      .number()
      .min(0, 'Max physical resistance cannot be negative'),
    mentalHealth: z.coerce.number().min(1, 'Mental health must be at least 1'),
    maxMentalHealth: z.coerce
      .number()
      .min(1, 'Max mental health must be at least 1'),
    mentalResistance: z.coerce
      .number()
      .min(0, 'Mental resistance cannot be negative'),
    maxMentalResistance: z.coerce
      .number()
      .min(0, 'Max mental resistance cannot be negative'),
    initiative: z.coerce.number().min(0, 'Initiative cannot be negative'),
    defense: z.coerce.number().min(0, 'Defense cannot be negative'),
    attack: z.coerce.number().min(0, 'Attack cannot be negative'),
    impact: z.coerce.number().min(0, 'Impact cannot be negative'),
    maxDamage: z.coerce.number().min(0, 'Max damage cannot be negative'),

    // Narrative fields
    externalProfile: z.string().optional(),
    internalProfile: z.string().optional(),
    background: z.string().optional(),
    specialties: z.string().optional(),

    // Inventory array - existing inventory items
    inventories: z
      .array(
        z.object({
          id: z.string().optional(), // Optional for new items
          name: z.string().min(1, 'Item name is required'),
          description: z.string().optional(),
          quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
          type: z.enum(['Objeto', 'Consumible']),
        })
      )
      .optional(),

    // New inventory item fields (for adding single items)
    newItemName: z.string().optional(),
    newItemDescription: z.string().optional(),
    newItemQuantity: z.coerce
      .number()
      .min(1, 'Quantity must be at least 1')
      .optional(),
    newItemType: z
      .enum(['Objeto', 'Consumible', 'placeholder'])
      .optional()
      .refine(
        (val) => !val || val !== 'placeholder',
        'Please select a valid item type'
      ),

    // Empty inventory message field
    emptyInventoryMessage: z.string().optional(),
  })
  .catchall(z.any()); // Allow dynamic fields for inventory items

export type CharacterFormData = z.infer<typeof characterFormSchema>;

// Function to create character form configuration with dynamic inventory fields
export const createCharacterFormConfig = (
  inventories: Array<{
    id: string;
    name: string;
    description?: string;
    quantity: number;
    type: string;
  }> = []
) => {
  // Generate inventory fields dynamically
  const inventoryFields = inventories.flatMap((item, index) => [
    createField('text', {
      name: `inventory_${item.id}_name`,
      label: `Objeto ${index + 1} - Nombre`,
      placeholder: 'Nombre del objeto',
      required: false,
      defaultValue: item.name,
    }),
    createField('select', {
      name: `inventory_${item.id}_type`,
      label: `Objeto ${index + 1} - Tipo`,
      options: [
        { value: 'Objeto', label: 'Objeto' },
        { value: 'Consumible', label: 'Consumible' },
      ],
      required: false,
      defaultValue: item.type,
    }),
    createField('number', {
      name: `inventory_${item.id}_quantity`,
      label: `Objeto ${index + 1} - Cantidad`,
      placeholder: '1',
      min: 1,
      required: false,
      defaultValue: item.quantity,
    }),
    createField('textarea', {
      name: `inventory_${item.id}_description`,
      label: `Objeto ${index + 1} - Descripción`,
      placeholder: 'Descripción del objeto...',
      rows: 2,
      required: false,
      defaultValue: item.description || '',
    }),
    createField('custom', {
      name: `inventory_${item.id}_delete`,
      label: `Eliminar Objeto ${index + 1}`,
      customComponent: 'deleteButton',
      customProps: {
        itemId: item.id,
        itemName: item.name,
        variant: 'destructive',
        size: 'sm',
      },
    }),
  ]);

  return createFormConfig({
    title: 'Ficha de Personaje',
    description: 'Edita la información del personaje',
    tabs: [
      createTab({
        id: 'stats',
        label: 'Estadísticas',
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
            description: 'Valores de 1 a 100',
            columns: 3,
            fields: [
              createField('number', {
                name: 'strength',
                label: 'Fuerza (FUE)',
                required: true,
                min: 1,
                max: 100,
                defaultValue: 1,
              }),
              createField('number', {
                name: 'agility',
                label: 'Agilidad (DIN)',
                required: true,
                min: 1,
                max: 100,
                defaultValue: 1,
              }),
              createField('number', {
                name: 'willpower',
                label: 'Voluntad (VOL)',
                required: true,
                min: 1,
                max: 100,
                defaultValue: 1,
              }),
              createField('number', {
                name: 'luck',
                label: 'Suerte (SUR)',
                required: true,
                min: 1,
                max: 100,
                defaultValue: 1,
              }),
              createField('number', {
                name: 'intelligence',
                label: 'Inteligencia (INT)',
                required: true,
                min: 1,
                max: 100,
                defaultValue: 1,
              }),
            ],
          }),
          createSection({
            title: 'Dominios',
            description: 'Valores de 0 a 100',
            columns: 2,
            fields: [
              createField('number', {
                name: 'physical',
                label: 'Físico',
                min: 0,
                max: 100,
                defaultValue: 0,
              }),
              createField('number', {
                name: 'combat',
                label: 'Batalla',
                min: 0,
                max: 100,
                defaultValue: 0,
              }),
              createField('number', {
                name: 'social',
                label: 'Social',
                min: 0,
                max: 100,
                defaultValue: 0,
              }),
              createField('number', {
                name: 'environmental',
                label: 'Ambiental',
                min: 0,
                max: 100,
                defaultValue: 0,
              }),
              createField('number', {
                name: 'stealth',
                label: 'Sigilo',
                min: 0,
                max: 100,
                defaultValue: 0,
              }),
              createField('number', {
                name: 'knowledge',
                label: 'Conocimiento',
                min: 0,
                max: 100,
                defaultValue: 0,
              }),
              createField('number', {
                name: 'technical',
                label: 'Técnico',
                min: 0,
                max: 100,
                defaultValue: 0,
              }),
              createField('number', {
                name: 'resources',
                label: 'Recursos',
                min: 0,
                max: 100,
                defaultValue: 0,
              }),
              createField('number', {
                name: 'demonic',
                label: 'Demoníaco',
                min: 0,
                max: 100,
                defaultValue: 0,
              }),
              createField('number', {
                name: 'aura',
                label: 'Aura',
                min: 0,
                max: 100,
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
                defaultValue: 100,
              }),
              createField('number', {
                name: 'maxPhysicalHealth',
                label: 'Salud física máxima',
                required: true,
                min: 1,
                defaultValue: 100,
              }),
              createField('number', {
                name: 'physicalResistance',
                label: 'Resistencia física actual',
                required: true,
                min: 0,
                defaultValue: 100,
              }),
              createField('number', {
                name: 'maxPhysicalResistance',
                label: 'Resistencia física máxima',
                required: true,
                min: 0,
                defaultValue: 100,
              }),
              createField('number', {
                name: 'mentalHealth',
                label: 'Salud mental actual',
                required: true,
                min: 0,
                defaultValue: 100,
              }),
              createField('number', {
                name: 'maxMentalHealth',
                label: 'Salud mental máxima',
                required: true,
                min: 1,
                defaultValue: 100,
              }),
              createField('number', {
                name: 'mentalResistance',
                label: 'Resistencia mental actual',
                required: true,
                min: 0,
                defaultValue: 100,
              }),
              createField('number', {
                name: 'maxMentalResistance',
                label: 'Resistencia mental máxima',
                required: true,
                min: 0,
                defaultValue: 100,
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
        ],
      }),
      createTab({
        id: 'narrative',
        label: 'Narrativa',
        sections: [
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
                placeholder:
                  'Cómo actúa y se presenta el personaje ante otros...',
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
      }),
      createTab({
        id: 'inventory',
        label: 'Inventario',
        sections: [
          createSection({
            title: 'Inventario Actual',
            description:
              inventories.length > 0
                ? 'Edita los objetos que posee el personaje'
                : 'No hay objetos en el inventario. Agrega nuevos objetos usando la sección de abajo.',
            columns: inventories.length > 0 ? 4 : 1,
            fields:
              inventories.length > 0
                ? inventoryFields
                : [
                    createField('text', {
                      name: 'emptyInventoryMessage',
                      label: 'Estado del inventario',
                      defaultValue: 'No hay objetos en el inventario',
                      disabled: true,
                    }),
                  ],
          }),
          createSection({
            title: 'Añadir Nuevo Objeto',
            description: 'Agrega un nuevo objeto al inventario del personaje',
            columns: 2,
            fields: [
              createField('text', {
                name: 'newItemName',
                label: 'Nombre del objeto',
                placeholder: 'Introduce el nombre del objeto...',
                required: false,
              }),
              createField('select', {
                name: 'newItemType',
                label: 'Tipo de objeto',
                options: [
                  { value: 'placeholder', label: 'Selecciona un tipo' },
                  { value: 'Objeto', label: 'Objeto' },
                  { value: 'Consumible', label: 'Consumible' },
                ],
                required: false,
              }),
              createField('number', {
                name: 'newItemQuantity',
                label: 'Cantidad',
                placeholder: '1',
                min: 1,
                defaultValue: 1,
                required: false,
              }),
              createField('textarea', {
                name: 'newItemDescription',
                label: 'Descripción (opcional)',
                placeholder: 'Describe el objeto...',
                rows: 3,
                required: false,
              }),
            ],
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
};

// Static configuration for when no inventories are provided
export const characterFormConfig = createCharacterFormConfig();
