'use client';

import { useCharacterContext } from '@/contexts/CharacterContext';
import { useCharacters } from '@/hooks';
import { Character } from '@/types';
import { FormBuilder } from '@/utils/form-builder';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Skeleton,
} from '@seapunk/ui';
import { Plus } from 'lucide-react';
import { useEffect } from 'react';
import CharacterDetail from './[id]/components/CharacterDetail';
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
    <div className='flex gap-4 h-full'>
      <Card className='w-80 flex-shrink-0'>
        <CardHeader>
          <div className='flex items-center justify-between'>
            <CardTitle>Lista de Personajes</CardTitle>
            <Dialog
              open={isCreating}
              onOpenChange={(open: boolean) => !open && handleCancel()}
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

      {selectedCharacterId && (
        <div className='flex-1 overflow-auto'>
          <CharacterDetail key={selectedCharacterId} id={selectedCharacterId} />
        </div>
      )}
    </div>
  );
}
