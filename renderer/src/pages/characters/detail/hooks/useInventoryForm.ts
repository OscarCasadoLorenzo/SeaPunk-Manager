import { useCharacterContext } from '@/contexts/CharacterContext';
import {
  useCreateInventory,
  useDeleteInventory,
  useInventories,
  useUpdateInventory,
} from '@/hooks/useInventories';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  inventoryFormSchema,
  type InventoryFormData,
} from '../schemas/inventoryFormSchema';

export const useInventoryForm = () => {
  const { selectedCharacterId } = useCharacterContext();

  // Data hooks
  const { data: inventories, isLoading: inventoriesLoading } = useInventories(
    selectedCharacterId || ''
  );

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
      newItemType: 'placeholder' as any,
      emptyInventoryMessage: 'No hay objetos en el inventario',
    };

    // Add dynamic inventory fields
    if (inventories && inventories.length > 0) {
      const dynamicFields = inventories.reduce(
        (acc, item) => {
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

  // Update form when data changes
  React.useEffect(() => {
    form.reset(getDefaultValues());
  }, [inventories, form]);

  // Submit handler
  const handleSubmit = async (data: InventoryFormData) => {
    if (!selectedCharacterId) return;

    try {
      // Update existing inventory items
      if (inventories && inventories.length > 0) {
        for (const item of inventories) {
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
      if (
        data.newItemName &&
        data.newItemType &&
        data.newItemType !== 'placeholder'
      ) {
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
