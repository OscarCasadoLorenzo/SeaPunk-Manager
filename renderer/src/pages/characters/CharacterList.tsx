import { useCharacterContext } from '@/contexts/CharacterContext';
import { useCharacters } from '@/hooks';
import { Character } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/primitives/card';
import { Skeleton } from '@/ui/primitives/skeleton';
import { useEffect } from 'react';

export default function CharacterList() {
  const { data, isLoading, isError } = useCharacters();
  const { selectedCharacterId, setSelectedCharacterId } = useCharacterContext();

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
        <CardTitle>Lista de Personajes</CardTitle>
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
