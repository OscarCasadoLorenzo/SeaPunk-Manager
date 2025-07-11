import { Card, CardContent } from '@/ui/primitives/card';
import { Skeleton } from '@/ui/primitives/skeleton';
import { FormBuilder } from '@/utils/form-builder';
import { useCharacterDetailLogic } from './use-character-detail-logic';

export default function CharacterInfoPage() {
  const {
    selectedCharacterId,
    isEditing,
    characterLoading,
    isLoading,
    character,
    narrative,
    effectsText,
    inventoryText,
    form,
    handleSubmit,
    handleCancelEdit,
    handleStartEdit,
    characterFormConfig,
  } = useCharacterDetailLogic();

  if (!selectedCharacterId) {
    return (
      <div className='flex flex-col items-center justify-center p-4 w-full max-w-4xl mx-auto h-full'>
        <Card className='w-full'>
          <CardContent className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>
              Selecciona un personaje para ver sus detalles
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (characterLoading) {
    return (
      <div className='flex flex-col items-center justify-center p-4 w-full max-w-4xl mx-auto'>
        <Card className='w-full'>
          <CardContent>
            <Skeleton className='h-96 w-full' />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!character) {
    return (
      <div className='flex flex-col items-center justify-center p-4 w-full max-w-4xl mx-auto h-full'>
        <Card className='w-full'>
          <CardContent className='flex items-center justify-center h-64'>
            <p className='text-red-500'>Error al cargar el personaje</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='flex flex-col p-4 w-full max-w-4xl mx-auto'>
      <FormBuilder
        config={{
          ...characterFormConfig,
          cancelButton: {
            text: 'Cancelar',
            onClick: handleCancelEdit,
          },
        }}
        form={form}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
