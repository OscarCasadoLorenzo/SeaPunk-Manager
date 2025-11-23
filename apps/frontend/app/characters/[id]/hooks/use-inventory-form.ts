import { useCharacterContext } from "@/contexts/CharacterContext";
import {
  useBulkUpdateInventory,
  useCreateInventory,
} from "@/hooks/useInventories";
import type { Character, Inventory } from "@/types";
import {
  createField,
  createFormConfig,
  createSection,
  type FormConfig,
  type FormMode,
  isFieldEditable,
} from "@/utils/form-builder";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// ✅ Schema defined inline
const inventoryFormSchema = z
  .object({
    newItemName: z.string().optional(),
    newItemDescription: z.string().optional(),
    newItemQuantity: z
      .number()
      .min(1, "Quantity must be at least 1")
      .optional(),
    newItemType: z.enum(["Objeto", "Consumible"]).optional(),
    emptyInventoryMessage: z.string().optional(),
    _hasItemsToDelete: z.boolean().optional(), // Hidden field to track deletion state
  })
  .catchall(z.any());

type InventoryFormData = z.infer<typeof inventoryFormSchema>;

export const useInventoryForm = (
  character: Character | null | undefined,
  mode: FormMode = "view",
  onSuccess?: () => void,
) => {
  const { selectedCharacterId } = useCharacterContext();

  // Extract data from the passed character object
  const inventories: Inventory[] = character?.inventories || [];

  // Track items marked for deletion
  const [itemsToDelete, setItemsToDelete] = React.useState<Set<string>>(
    new Set(),
  );

  // Mutation hooks
  const createInventory = useCreateInventory();
  const bulkUpdateInventory = useBulkUpdateInventory();

  // ✅ Extract current values for default form values
  const getDefaultValues = (): InventoryFormData => {
    const baseValues: InventoryFormData = {
      newItemName: "",
      newItemDescription: "",
      newItemQuantity: 1,
      newItemType: undefined,
      emptyInventoryMessage: "No hay objetos en el inventario",
      _hasItemsToDelete: false,
    };

    // Add dynamic inventory fields
    if (inventories && inventories.length > 0) {
      const dynamicFields = inventories.reduce(
        (acc: Record<string, string | number>, item: Inventory) => {
          acc[`inventory_${item.id}_name`] = item.name;
          acc[`inventory_${item.id}_description`] = item.description || "";
          acc[`inventory_${item.id}_quantity`] = item.quantity;
          acc[`inventory_${item.id}_type`] = item.type;
          return acc;
        },
        {} as Record<string, string | number>,
      );

      return {
        ...baseValues,
        ...dynamicFields,
      };
    }

    return baseValues;
  };

  // ✅ Form configuration inline
  const formConfig: FormConfig = React.useMemo(() => {
    const sections = [];

    // Display all inventory items (don't filter out marked for deletion)
    if (inventories.length > 0) {
      inventories.forEach((item: Inventory) => {
        const fields = [
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
        ];

        // Add delete button field in edit mode
        if (isFieldEditable(mode)) {
          const isMarkedForDeletion = itemsToDelete.has(item.id);
          fields.push(
            createField("custom", {
              name: `inventory_${item.id}_delete`,
              label: "",
              customComponent: "delete-button",
              customProps: {
                itemId: item.id,
                itemName: item.name,
                isMarkedForDeletion,
                onDelete: () => handleMarkForDeletion(item.id, item.name),
              },
            }),
          );
        }

        sections.push(
          createSection({
            title: itemsToDelete.has(item.id)
              ? `${item.name} (Se eliminará al guardar)`
              : item.name,
            columns: 2,
            fields,
            className: itemsToDelete.has(item.id)
              ? "opacity-60 border-2 border-red-500"
              : undefined,
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
            }),
            createField("select", {
              name: "newItemType",
              label: "Tipo",
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
              rows: 3,
              className: "col-span-2",
            }),
            createField("number", {
              name: "newItemQuantity",
              label: "Cantidad",
              min: 1,
              defaultValue: 1,
            }),
          ],
        }),
      );
    }

    return createFormConfig({ sections });
  }, [inventories, mode, itemsToDelete]);

  // Form setup
  const form = useForm<InventoryFormData>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: getDefaultValues(),
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  // Update form when data changes
  React.useEffect(() => {
    if (selectedCharacterId) {
      form.reset(getDefaultValues());
      // Clear items to delete when switching characters
      setItemsToDelete(new Set());
    }
  }, [inventories, selectedCharacterId]);

  // Handler to mark an item for deletion
  const handleMarkForDeletion = (itemId: string, itemName: string) => {
    setItemsToDelete((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
        toast.info(`"${itemName}" restaurado`);
      } else {
        newSet.add(itemId);
        toast.info(`"${itemName}" se eliminará al guardar cambios`);
      }

      // Mark form as dirty to enable save button
      // We do this by setting a hidden tracking field
      form.setValue("_hasItemsToDelete", newSet.size > 0, {
        shouldDirty: true,
        shouldValidate: true,
      });

      return newSet;
    });
  };

  // ✅ Submit handler
  const handleSubmit = async (data: InventoryFormData): Promise<void> => {
    if (!selectedCharacterId) return;

    try {
      // Build the updated inventory list (excluding items marked for deletion)
      const updatedInventories = inventories
        .filter((item: Inventory) => !itemsToDelete.has(item.id))
        .map((item: Inventory) => {
          const nameKey = `inventory_${item.id}_name`;
          const descriptionKey = `inventory_${item.id}_description`;
          const quantityKey = `inventory_${item.id}_quantity`;
          const typeKey = `inventory_${item.id}_type`;

          return {
            name: (data[nameKey] as string) || item.name,
            description: (data[descriptionKey] as string) || item.description,
            quantity: (data[quantityKey] as number) || item.quantity,
            type: (data[typeKey] as string) || item.type,
          };
        });

      // Add new item if provided
      if (data.newItemName && data.newItemType) {
        updatedInventories.push({
          name: data.newItemName,
          description: data.newItemDescription || "",
          quantity: data.newItemQuantity || 1,
          type: data.newItemType,
        });
      }

      // Perform bulk update
      await bulkUpdateInventory.mutateAsync({
        characterId: selectedCharacterId,
        inventories: updatedInventories,
      });

      // Show success message
      if (itemsToDelete.size > 0) {
        toast.success(
          `Inventario actualizado: ${itemsToDelete.size} objeto(s) eliminado(s)`,
        );
      } else {
        toast.success("Inventario actualizado correctamente");
      }

      // Clear state
      setItemsToDelete(new Set());
      form.setValue("_hasItemsToDelete", false, { shouldDirty: false });

      // Clear new item fields
      if (data.newItemName) {
        form.setValue("newItemName", "");
        form.setValue("newItemDescription", "");
        form.setValue("newItemQuantity", 1);
        form.setValue("newItemType", undefined);
      }

      onSuccess?.();
    } catch (error) {
      toast.error("Error al actualizar el inventario");
      console.error("Error updating inventory:", error);
    }
  };

  // Loading state
  const isLoading = createInventory.isPending || bulkUpdateInventory.isPending;

  return {
    form,
    formConfig, // ✅ Config exposed from hook
    handleSubmit,
    handleMarkForDeletion,
    itemsToDelete,
    isLoading,
  };
};
