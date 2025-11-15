import {
  createField,
  createSection,
  type FormSectionConfig,
} from "@/utils/form-builder";
import { type FormMode, isFieldEditable } from "../types/form-mode";

export const createInventoryFormSections = (
  mode: FormMode,
  inventories: any[] = [],
): FormSectionConfig[] => {
  const sections: FormSectionConfig[] = [];

  // Display inventory items
  if (inventories && inventories.length > 0) {
    inventories.forEach((item) => {
      sections.push(
        createSection({
          title: item.name,
          className: "relative",
          columns: 2,
          fields: [
            createField("text", {
              name: `inventory_${item.id}_name`,
              label: "Nombre",
              disabled: !isFieldEditable(mode),
              defaultValue: item.name,
            }),
            createField("select", {
              name: `inventory_${item.id}_type`,
              label: "Tipo",
              disabled: !isFieldEditable(mode),
              options: [
                { value: "Objeto", label: "Objeto" },
                { value: "Consumible", label: "Consumible" },
              ],
              defaultValue: item.type,
            }),
            createField("textarea", {
              name: `inventory_${item.id}_description`,
              label: "Descripción",
              disabled: !isFieldEditable(mode),
              defaultValue: item.description || "",
              rows: 3,
              className: "col-span-2",
            }),
            createField("number", {
              name: `inventory_${item.id}_quantity`,
              label: "Cantidad",
              disabled: !isFieldEditable(mode),
              min: 1,
              defaultValue: item.quantity,
            }),
          ],
        }),
      );
    });
  } else {
    // Empty state section
    sections.push(
      createSection({
        title: "Inventario Vacío",
        columns: 1,
        fields: [
          createField("text", {
            name: "emptyInventoryMessage",
            label: "",
            disabled: true,
            defaultValue: "No hay objetos en el inventario",
            className: "text-center text-muted-foreground",
          }),
        ],
      }),
    );
  }

  // Add new item section (only in editable modes)
  if (isFieldEditable(mode)) {
    sections.push(
      createSection({
        title: "Agregar Nuevo Objeto",
        description: "Añade un nuevo objeto al inventario",
        columns: 2,
        fields: [
          createField("text", {
            name: "newItemName",
            label: "Nombre",
            placeholder: "Nombre del objeto",
            disabled: !isFieldEditable(mode),
          }),
          createField("select", {
            name: "newItemType",
            label: "Tipo",
            disabled: !isFieldEditable(mode),
            options: [
              { value: "Objeto", label: "Objeto" },
              { value: "Consumible", label: "Consumible" },
            ],
            placeholder: "Seleccionar tipo",
          }),
          createField("textarea", {
            name: "newItemDescription",
            label: "Descripción",
            placeholder: "Descripción del objeto (opcional)",
            disabled: !isFieldEditable(mode),
            rows: 3,
            className: "col-span-2",
          }),
          createField("number", {
            name: "newItemQuantity",
            label: "Cantidad",
            disabled: !isFieldEditable(mode),
            min: 1,
            defaultValue: 1,
          }),
        ],
      }),
    );
  }

  return sections;
};
