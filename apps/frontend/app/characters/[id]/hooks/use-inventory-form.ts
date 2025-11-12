import { useCharacterContext } from '@/contexts/CharacterContext';
import {
  useCreateInventory,
  useDeleteInventory,
  useUpdateInventory,
} from '@/hooks/useInventories';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  inventoryFormSchema,
  type InventoryFormData,
} from '../schemas/inventory-form-schema';

export const useInventoryForm = (character: any) => {
  const { selectedCharacterId } = useCharacterContext();

  // Extract data from the passed character object
  const inventories = character?.inventories || [];
  const inventoriesLoading = false;

  // Mutation hooks
  const createInventory = useCreateInventory();
  const updateInventory = useUpdateInventory();
  const deleteInventory = useDeleteInventory();

  // Extract current values for default form values
  const getDefaultValues = (): InventoryFormData => {
    const baseValues: InventoryFormData = {
      newItemName: '',
      newItemDescription: '',
      newItemQuantity: 1,
      newItemType: 'Objeto',
      emptyInventoryMessage: 'No hay objetos en el inventario',
    };

    // Add dynamic inventory fields
    if (inventories && inventories.length > 0) {
      const dynamicFields = inventories.reduce(
        (acc: any, item: any) => {
          acc[`inventory_${item.id}_name`] = item.name;
          acc[`inventory_${item.id}_description`] = item.description || '';
          acc[`inventory_${item.id}_quantity`] = item.quantity;
          acc[`inventory_${item.id}_type`] = item.type;
          return acc;
        },
        {} as Record<string, any>
      );

      return {
        ...baseValues,
        ...dynamicFields,
      };
    }

    return baseValues;
  };

  // Form setup
  const form = useForm<InventoryFormData>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  // Reset form when character changes (immediate reset to prevent showing old data)
  React.useEffect(() => {
    if (selectedCharacterId) {
      // Immediately reset to default empty values when character changes
      form.reset({
        newItemName: '',
        newItemDescription: '',
        newItemQuantity: 1,
        newItemType: 'placeholder' as any,
        emptyInventoryMessage: 'No hay objetos en el inventario',
      });
    }
  }, [selectedCharacterId]);

  // Update form with actual inventory data when it loads
  React.useEffect(() => {
    if (inventories && selectedCharacterId) {
      const defaultValues = getDefaultValues();
      form.reset(defaultValues);
    }
  }, [inventories, selectedCharacterId]);

  // Submit handler
  const handleSubmit = async (data: InventoryFormData) => {
    if (!selectedCharacterId) return;

    const invs = inventories as any[];

    try {
      // Update existing inventory items
      if (invs && invs.length > 0) {
        for (const item of invs) {
          const nameKey = `inventory_${item.id}_name`;
          const descriptionKey = `inventory_${item.id}_description`;
          const quantityKey = `inventory_${item.id}_quantity`;
          const typeKey = `inventory_${item.id}_type`;

          if (
            data[nameKey] !== undefined ||
            data[descriptionKey] !== undefined ||
            data[quantityKey] !== undefined ||
            data[typeKey] !== undefined
          ) {
            await updateInventory.mutateAsync({
              id: item.id,
              data: {
                name: (data[nameKey] as string) || item.name,
                description:
                  (data[descriptionKey] as string) || item.description,
                quantity: (data[quantityKey] as number) || item.quantity,
                type: (data[typeKey] as string) || item.type,
              },
            });
          }
        }
      }

      // Create new inventory item if provided
      if (data.newItemName && data.newItemType) {
        await createInventory.mutateAsync({
          characterId: selectedCharacterId,
          name: data.newItemName,
          description: data.newItemDescription || '',
          quantity: data.newItemQuantity || 1,
          type: data.newItemType,
        });

        // Clear the new item fields after successful creation
        form.setValue('newItemName', '');
        form.setValue('newItemDescription', '');
        form.setValue('newItemQuantity', 1);
        form.setValue('newItemType', 'placeholder' as any);
      }

      toast.success('Inventario actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el inventario');
      console.error('Error updating inventory:', error);
    }
  };

  // Inventory management functions
  const handleUpdateInventoryItem = async (
    itemId: string,
    updates: {
      name?: string;
      description?: string;
      quantity?: number;
      type?: string;
    }
  ) => {
    try {
      await updateInventory.mutateAsync({
        id: itemId,
        data: updates,
      });
      toast.success('Objeto actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el objeto');
      console.error('Error updating inventory item:', error);
    }
  };

  const handleDeleteInventoryItem = async (
    itemId: string,
    itemName: string
  ) => {
    try {
      await deleteInventory.mutateAsync(itemId);
      toast.success(`"${itemName}" eliminado del inventario`);
    } catch (error) {
      toast.error('Error al eliminar el objeto');
      console.error('Error deleting inventory item:', error);
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
    handleSubmit,
    isLoading,
    inventoriesLoading,
    inventories,
    handleUpdateInventoryItem,
    handleDeleteInventoryItem,
  };
};
