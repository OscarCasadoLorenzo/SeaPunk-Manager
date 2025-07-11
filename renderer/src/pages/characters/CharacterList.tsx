import { useCharacterContext } from '@/contexts/CharacterContext';
import { useCharacters } from '@/hooks';
import { Character } from '@/types';
import { Button } from '@/ui/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/primitives/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/primitives/dialog';
import { Skeleton } from '@/ui/primitives/skeleton';
import { FormBuilder } from '@/utils/form-builder';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import { useCreateCharacterLogic } from './useCreateCharacterLogic';

export default function CharacterList() {
  const { data, isLoading, isError } = useCharacters();
  const { selectedCharacterId, setSelectedCharacterId } = useCharacterContext();
  const {
    isCreating,
    isLoading: isCreatingLoading,
    form,
    handleSubmit,
    handleCancel,
    handleStartCreation,
    createCharacterFormConfig,
  } = useCreateCharacterLogic();

  useEffect(() => {
    console.log('CharacterList component mounted');
    console.log('Data:', data);
  }, [data]);

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacterId(characterId);
  };

  return (
    <Card>
      <CardHeader>
        <div className='flex items-center justify-between'>
          <CardTitle>Lista de Personajes</CardTitle>
          <Dialog
            open={isCreating}
            onOpenChange={(open) => !open && handleCancel()}
          >
            <DialogTrigger asChild>
              <Button
                onClick={handleStartCreation}
                size='sm'
                className='flex items-center gap-2'
              >
                <Plus className='h-4 w-4' />
              </Button>
            </DialogTrigger>
            <DialogContent className='max-w-4xl max-h-[90vh] overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Crear Nuevo Personaje</DialogTitle>
              </DialogHeader>
              <div className='mt-4'>
                <FormBuilder
                  config={{
                    ...createCharacterFormConfig,
                    cancelButton: {
                      text: 'Cancelar',
                      onClick: handleCancel,
                    },
                  }}
                  form={form}
                  onSubmit={handleSubmit}
                  isLoading={isCreatingLoading}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className='h-8 w-full' />
        ) : isError ? (
          <div className='text-red-500'>Error al cargar personajes.</div>
        ) : (
          <div>
            {data && data.length > 0 ? (
              data.map((char: Character) => (
                <div
                  key={char.id}
                  className={`cursor-pointer hover:bg-muted/50 ${
                    selectedCharacterId === char.id ? 'bg-muted' : ''
                  }`}
                  onClick={() => handleCharacterSelect(char.id)}
                >
                  <span className='font-medium'>{char.characterName}</span>
                </div>
              ))
            ) : (
              <div>
                <span className='text-center'>No hay personajes.</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
