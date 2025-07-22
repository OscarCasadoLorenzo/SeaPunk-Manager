import { FormBuilder } from '@/utils/form-builder';
import { statsFormConfig } from '../configs/statsFormConfig';
import { useStatsForm } from '../hooks/useStatsForm';

export const StatsTab = () => {
  const { form, handleSubmit, isLoading, characterLoading } = useStatsForm();

  if (characterLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        Cargando estadísticas...
      </div>
    );
  }

  return (
    <FormBuilder
      config={statsFormConfig}
      form={form}
      onSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
