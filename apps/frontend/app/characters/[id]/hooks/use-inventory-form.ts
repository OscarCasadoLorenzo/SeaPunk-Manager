import { useCharacterContext } from "@/contexts/CharacterContext";
import {
  useCreateInventory,
  useDeleteInventory,
  useUpdateInventory,
} from "@/hooks/useInventories";
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
  })
  .catchall(z.any());

type InventoryFormData = z.infer<typeof inventoryFormSchema>;

export const useInventoryForm = (
  character: any,
  mode: FormMode = "view",
  onSuccess?: () => void,
) => {
  const { selectedCharacterId } = useCharacterContext();

  // Extract data from the passed character object
  const inventories = character?.inventories || [];

  // Mutation hooks
  const createInventory = useCreateInventory();
  const updateInventory = useUpdateInventory();
  const deleteInventory = useDeleteInventory();

  // ✅ Extract current values for default form values
  const getDefaultValues = (): InventoryFormData => {
    const baseValues: InventoryFormData = {
      newItemName: "",
      newItemDescription: "",
      newItemQuantity: 1,
      newItemType: undefined,
      emptyInventoryMessage: "No hay objetos en el inventario",
    };

    // Add dynamic inventory fields
    if (inventories && inventories.length > 0) {
      const dynamicFields = inventories.reduce(
        (acc: any, item: any) => {
          acc[`inventory_${item.id}_name`] = item.name;
          acc[`inventory_${item.id}_description`] = item.description || "";
          acc[`inventory_${item.id}_quantity`] = item.quantity;
          acc[`inventory_${item.id}_type`] = item.type;
          return acc;
        },
        {} as Record<string, any>,
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

    // Display inventory items
    if (inventories.length > 0) {
      inventories.forEach((item: any) => {
        sections.push(
          createSection({
            title: item.name,
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
  }, [inventories, mode]);

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
    }
  }, [inventories, selectedCharacterId]);

  // ✅ Submit handler
  const handleSubmit = async (data: InventoryFormData): Promise<void> => {
    if (!selectedCharacterId) return;

    try {
      // Update existing inventory items
      if (inventories && inventories.length > 0) {
        for (const item of inventories) {
          const nameKey = `inventory_${item.id}_name`;
          const descriptionKey = `inventory_${item.id}_description`;
          const quantityKey = `inventory_${item.id}_quantity`;
          const typeKey = `inventory_${item.id}_type`;

          await updateInventory.mutateAsync({
            id: item.id,
            data: {
              name: (data[nameKey] as string) || item.name,
              description: (data[descriptionKey] as string) || item.description,
              quantity: (data[quantityKey] as number) || item.quantity,
              type: (data[typeKey] as string) || item.type,
            },
          });
        }
      }

      // Create new item if provided
      if (data.newItemName && data.newItemType) {
        await createInventory.mutateAsync({
          characterId: selectedCharacterId,
          name: data.newItemName,
          description: data.newItemDescription || "",
          quantity: data.newItemQuantity || 1,
          type: data.newItemType,
        });

        // Clear new item fields
        form.setValue("newItemName", "");
        form.setValue("newItemDescription", "");
        form.setValue("newItemQuantity", 1);
        form.setValue("newItemType", undefined);
      }

      toast.success("Inventario actualizado correctamente");
      onSuccess?.();
    } catch (error) {
      toast.error("Error al actualizar el inventario");
      console.error("Error updating inventory:", error);
    }
  };

  // Delete handler
  const handleDeleteInventoryItem = async (
    itemId: string,
    itemName: string,
  ) => {
    try {
      await deleteInventory.mutateAsync(itemId);
      toast.success(`"${itemName}" eliminado del inventario`);
    } catch (error) {
      toast.error("Error al eliminar el objeto");
      console.error("Error deleting inventory item:", error);
    }
  };

  // Expose delete handler globally for custom delete buttons
  React.useEffect(() => {
    (window as any).__deleteInventoryHandler = handleDeleteInventoryItem;
    return () => {
      delete (window as any).__deleteInventoryHandler;
    };
  }, [handleDeleteInventoryItem]);

  // Loading state
  const isLoading =
    createInventory.isPending ||
    updateInventory.isPending ||
    deleteInventory.isPending;

  return {
    form,
    formConfig, // ✅ Config exposed from hook
    handleSubmit,
    handleDeleteInventoryItem,
    isLoading,
  };
};
