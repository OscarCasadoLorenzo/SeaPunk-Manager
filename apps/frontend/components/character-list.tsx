'use client';

import { useApiQuery } from '@/hooks/use-api-query';

import { LoadingSpinner } from './loading-spinner';

// Define Character type locally or import from types
type Character = {
  id: string;
  characterName: string;
  level: number;
  archetype: string;
  faction?: string;
  race?: string;
  player?: {
    playerName: string;
  };
};

export function CharacterList() {
  const {
    data: characters,
    isLoading,
    error,
  } = useApiQuery<Character[]>('/characters');

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Failed to load characters</div>;
  if (!characters?.length) return <div>No characters found</div>;

  return (
    <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
      {characters.map((character) => (
        <div
          key={character.id}
          className='rounded-lg border bg-card p-4 text-card-foreground shadow-sm'
        >
          <h3 className='text-lg font-semibold'>{character.characterName}</h3>
          <p className='text-sm text-muted-foreground'>
            Level {character.level} {character.archetype}
          </p>
          <div className='mt-4'>
            <div className='flex items-center justify-between'>
              <span className='text-sm text-muted-foreground'>
                {character.faction}
              </span>
              <span className='text-sm'>{character.race}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
