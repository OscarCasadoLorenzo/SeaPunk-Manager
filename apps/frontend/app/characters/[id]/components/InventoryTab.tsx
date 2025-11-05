'use client';

import { useInventoryForm } from '../hooks/use-inventory-form';

interface InventoryTabProps {
  character: any;
}

export const InventoryTab = ({ character }: InventoryTabProps) => {
  const { form, handleSubmit, isLoading, inventoriesLoading, inventories } =
    useInventoryForm(character);

  if (inventoriesLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        Cargando inventario...
      </div>
    );
  }

  const items = character?.inventories || [];

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold'>Inventario</h2>

      {items.length === 0 ? (
        <div className='p-8 text-center text-muted-foreground bg-muted rounded-lg'>
          No hay objetos en el inventario
        </div>
      ) : (
        <div className='grid gap-4'>
          {items.map((item: any) => (
            <div key={item.id} className='p-4 bg-muted rounded-lg'>
              <div className='flex justify-between items-start mb-2'>
                <h3 className='font-bold'>{item.name}</h3>
                <span className='text-sm bg-primary/10 px-2 py-1 rounded'>
                  {item.type}
                </span>
              </div>
              {item.description && (
                <p className='text-sm text-muted-foreground mb-2'>
                  {item.description}
                </p>
              )}
              <div className='text-sm'>
                <strong>Cantidad:</strong> {item.quantity}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
