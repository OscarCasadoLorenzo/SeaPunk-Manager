import { z } from 'zod';

// Inventory form validation schema
export const inventoryFormSchema = z
  .object({
    // New inventory item fields (for adding single items)
    newItemName: z.string().optional(),
    newItemDescription: z.string().optional(),
    newItemQuantity: z
      .number()
      .min(1, 'Quantity must be at least 1')
      .optional(),
    newItemType: z.enum(['Objeto', 'Consumible']).optional(),

    // Empty inventory message field
    emptyInventoryMessage: z.string().optional(),
  })
  .catchall(z.any()); // Allow dynamic fields for inventory items

export type InventoryFormData = z.infer<typeof inventoryFormSchema>;
