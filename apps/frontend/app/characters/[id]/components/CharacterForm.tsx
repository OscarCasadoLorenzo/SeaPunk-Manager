'use client';

import { FormBuilder, createFormConfig } from '@/utils/form-builder';
import { Button } from '@seapunk/ui';
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { createInventoryFormSections } from '../config/inventory-form-config';
import { createNarrativeFormSections } from '../config/narrative-form-config';
import { createStatsFormSections } from '../config/stats-form-config';

interface CharacterFormProps {
  character: any;
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export const CharacterForm = ({
  character,
  form,
  onSubmit,
  isLoading = false,
}: CharacterFormProps) => {
  const [isEditMode, setIsEditMode] = useState(false);

  // Get form state to check if there are changes
  const isDirty = form.formState.isDirty;
  const isValid = form.formState.isValid;

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditMode && isDirty) {
      // If exiting edit mode with unsaved changes, confirm
      const confirmDiscard = window.confirm(
        '¿Deseas descartar los cambios sin guardar?'
      );
      if (confirmDiscard) {
        form.reset();
        setIsEditMode(false);
      }
    } else {
      setIsEditMode(!isEditMode);
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
    setIsEditMode(false);
  };

  // Handle cancel
  const handleCancel = () => {
    form.reset();
    setIsEditMode(false);
  };

  // Create form configuration with tabs
  const formConfig = createFormConfig({
    tabs: [
      {
        id: 'stats',
        label: 'Estadísticas',
        sections: createStatsFormSections(isEditMode),
      },
      {
        id: 'narrative',
        label: 'Narrativa',
        sections: createNarrativeFormSections(isEditMode),
      },
      {
        id: 'inventory',
        label: 'Inventario',
        sections: createInventoryFormSections(
          isEditMode,
          character?.inventories || []
        ),
      },
    ],
    submitButton: {
      text: 'Guardar Cambios',
      disabled: !isDirty || !isValid || isLoading,
      loading: isLoading,
    },
    cancelButton: {
      text: 'Cancelar',
      onClick: handleCancel,
    },
  });

  return (
    <div className='space-y-6'>
      {/* Header with character name and edit button */}
      <div className='flex justify-between items-start'>
        <div className='space-y-2'>
          <h1 className='text-3xl font-bold tracking-tight'>
            Ficha de Personaje
          </h1>
          <p className='text-muted-foreground'>
            {isEditMode
              ? `Editando: ${character?.characterName || 'Personaje'}`
              : `Vista de: ${character?.characterName || 'Personaje'}`}
          </p>
        </div>

        <Button
          onClick={handleEditToggle}
          variant={isEditMode ? 'outline' : 'default'}
        >
          {isEditMode ? 'Cancelar Edición' : 'Editar Personaje'}
        </Button>
      </div>

      {/* Form Builder */}
      <FormBuilder
        config={formConfig}
        form={form}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />

      {/* Show dirty indicator when changes detected */}
      {isEditMode && isDirty && (
        <div className='text-sm text-amber-600 text-center p-4 bg-amber-50 border border-amber-200 rounded-lg'>
          ⚠️ Tienes cambios sin guardar. Haz clic en "Guardar Cambios" para
          aplicarlos.
        </div>
      )}
    </div>
  );
};
