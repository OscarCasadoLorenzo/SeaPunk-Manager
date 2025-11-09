import {
  createField,
  createSection,
  type FormSectionConfig,
} from '@/utils/form-builder';

export const createInventoryFormSections = (
  isEditMode: boolean,
  inventories: any[] = []
): FormSectionConfig[] => {
  const sections: FormSectionConfig[] = [];

  // Display inventory items
  if (inventories && inventories.length > 0) {
    inventories.forEach((item) => {
      sections.push(
        createSection({
          title: item.name,
          className: 'relative',
          columns: 2,
          fields: [
            createField('text', {
              name: `inventory_${item.id}_name`,
              label: 'Nombre',
              disabled: !isEditMode,
              defaultValue: item.name,
            }),
            createField('select', {
              name: `inventory_${item.id}_type`,
              label: 'Tipo',
              disabled: !isEditMode,
              options: [
                { value: 'Objeto', label: 'Objeto' },
                { value: 'Consumible', label: 'Consumible' },
              ],
              defaultValue: item.type,
            }),
            createField('textarea', {
              name: `inventory_${item.id}_description`,
              label: 'Descripción',
              disabled: !isEditMode,
              defaultValue: item.description || '',
              rows: 3,
              className: 'col-span-2',
            }),
            createField('number', {
              name: `inventory_${item.id}_quantity`,
              label: 'Cantidad',
              disabled: !isEditMode,
              min: 1,
              defaultValue: item.quantity,
            }),
          ],
        })
      );
    });
  } else {
    // Empty state section
    sections.push(
      createSection({
        title: 'Inventario Vacío',
        columns: 1,
        fields: [
          createField('text', {
            name: 'emptyInventoryMessage',
            label: '',
            disabled: true,
            defaultValue: 'No hay objetos en el inventario',
            className: 'text-center text-muted-foreground',
          }),
        ],
      })
    );
  }

  // Add new item section (only in edit mode)
  if (isEditMode) {
    sections.push(
      createSection({
        title: 'Agregar Nuevo Objeto',
        description: 'Añade un nuevo objeto al inventario',
        columns: 2,
        fields: [
          createField('text', {
            name: 'newItemName',
            label: 'Nombre',
            placeholder: 'Nombre del objeto',
            disabled: !isEditMode,
          }),
          createField('select', {
            name: 'newItemType',
            label: 'Tipo',
            disabled: !isEditMode,
            options: [
              { value: 'Objeto', label: 'Objeto' },
              { value: 'Consumible', label: 'Consumible' },
            ],
            placeholder: 'Seleccionar tipo',
          }),
          createField('textarea', {
            name: 'newItemDescription',
            label: 'Descripción',
            placeholder: 'Descripción del objeto (opcional)',
            disabled: !isEditMode,
            rows: 3,
            className: 'col-span-2',
          }),
          createField('number', {
            name: 'newItemQuantity',
            label: 'Cantidad',
            disabled: !isEditMode,
            min: 1,
            defaultValue: 1,
          }),
        ],
      })
    );
  }

  return sections;
};
