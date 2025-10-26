import type { Character } from '@seapunk/types';
import { useQuery } from '@tanstack/react-query';
import { LoadingSpinner } from './loading-spinner';

async function getCharacters() {
  const res = await fetch('http://localhost:3001/characters');
  if (!res.ok) throw new Error('Failed to fetch characters');
  return res.json() as Promise<Character[]>;
}

export function CharacterList() {
  const {
    data: characters,
    isLoading,
    error,
  } = useQuery(['characters'], getCharacters);

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
          <h3 className='text-lg font-semibold'>{character.name}</h3>
          <p className='text-sm text-muted-foreground'>
            Level {character.level}
          </p>
          <div className='mt-4'>
            <div className='flex items-center justify-between'>
              <span>HP</span>
              <span>
                {character.health.current}/{character.health.max}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
