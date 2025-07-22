import {
  createField,
  createFormConfig,
  createSection,
} from '@/utils/form-builder';

export const createInventoryFormConfig = (
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
    title: 'Inventario del Personaje',
    description: 'Gestiona los objetos que posee el personaje',
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
    submitButton: {
      text: 'Guardar Inventario',
      className: 'bg-purple-600 hover:bg-purple-700',
    },
  });
};

export const inventoryFormConfig = createInventoryFormConfig();
