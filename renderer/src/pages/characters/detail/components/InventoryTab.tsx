import { FormBuilder } from '@/utils/form-builder';
import React from 'react';
import { createInventoryFormConfig } from '../configs/inventoryFormConfig';
import { useInventoryForm } from '../hooks/useInventoryForm';

export const InventoryTab = () => {
  const { form, handleSubmit, isLoading, inventoriesLoading, inventories } =
    useInventoryForm();

  const inventoryFormConfig = React.useMemo(() => {
    return createInventoryFormConfig(inventories || []);
  }, [inventories]);

  if (inventoriesLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        Cargando inventario...
      </div>
    );
  }

  return (
    <FormBuilder
      config={inventoryFormConfig}
      form={form}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
