'use client';

import { getCharacter } from '@/app/api/characters/[id]/actions';
import { Card } from '@seapunk/ui';
import { useQuery } from '@tanstack/react-query';
import { CharacterTabs } from './CharacterTabs';

interface CharacterDetailProps {
  id: string;
}

export function CharacterDetail({ id }: CharacterDetailProps) {
  const {
    data: character,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['characters', id],
    queryFn: () => getCharacter(id),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !character) {
    return <div>Error loading character</div>;
  }

  return (
    <>
      <h1 className='text-3xl font-bold mb-6'>{character.characterName}</h1>
      <div className='flex flex-col gap-6'>
        <Card className='p-6'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            <div>
              <p className='text-sm text-muted-foreground'>Level</p>
              <p className='text-lg font-medium'>{character.level}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Race</p>
              <p className='text-lg font-medium'>{character.race}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Archetype</p>
              <p className='text-lg font-medium'>{character.archetype}</p>
            </div>
            <div>
              <p className='text-sm text-muted-foreground'>Faction</p>
              <p className='text-lg font-medium'>{character.faction}</p>
            </div>
          </div>
        </Card>
        <CharacterTabs character={character} />
      </div>
    </>
  );
}
