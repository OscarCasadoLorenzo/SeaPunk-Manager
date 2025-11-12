'use client';

import { useNarrativeForm } from '../hooks/use-narrative-form';

interface NarrativeTabProps {
  character: any;
}

export const NarrativeTab = ({ character }: NarrativeTabProps) => {
  const { form, handleSubmit, isLoading, narrativeLoading } =
    useNarrativeForm(character);

  if (narrativeLoading) {
    return (
      <div className='flex items-center justify-center p-8'>
        Cargando narrativa...
      </div>
    );
  }

  const narrative = character?.narrative;

  return (
    <div className='space-y-6'>
      <h2 className='text-2xl font-bold'>Narrativa del Personaje</h2>

      <div className='space-y-4'>
        <div className='p-4 bg-muted rounded-lg'>
          <h3 className='font-bold mb-2'>Descripción Física</h3>
          <p>{narrative?.physicalDescription || 'No especificado'}</p>
        </div>

        <div className='p-4 bg-muted rounded-lg'>
          <h3 className='font-bold mb-2'>Perfil Externo</h3>
          <p>{narrative?.externalProfile || 'No especificado'}</p>
        </div>

        <div className='p-4 bg-muted rounded-lg'>
          <h3 className='font-bold mb-2'>Perfil Interno</h3>
          <p>{narrative?.internalProfile || 'No especificado'}</p>
        </div>

        <div className='p-4 bg-muted rounded-lg'>
          <h3 className='font-bold mb-2'>Trasfondo</h3>
          <p>{narrative?.background || 'No especificado'}</p>
        </div>

        <div className='p-4 bg-muted rounded-lg'>
          <h3 className='font-bold mb-2'>Especialidades</h3>
          <p>{narrative?.specialties || 'No especificado'}</p>
        </div>
      </div>
    </div>
  );
};
