import { FormBuilder } from '@/utils/form-builder';
import { narrativeFormConfig } from '../configs/narrativeFormConfig';
import { useNarrativeForm } from '../hooks/useNarrativeForm';

export const NarrativeTab = () => {
  const { form, handleSubmit, isLoading, narrativeLoading } =
    useNarrativeForm();

  if (narrativeLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        Cargando narrativa...
      </div>
    );
  }

  return (
    <FormBuilder
      config={narrativeFormConfig}
      form={form}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
