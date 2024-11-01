'use client';

import Link from 'next/link';

interface CharacterListProps {
  characters: Character[];
}

export function CharacterList({ characters }: CharacterListProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
      {characters.map((character) => (
        <Link
          key={character.id}
          href={`/characters/${character.id}`}
          className='block p-6 bg-card rounded-lg shadow hover:shadow-lg transition-shadow'
        >
          <h2 className='text-xl font-bold mb-2'>{character.characterName}</h2>
          <div className='text-muted-foreground'>
            <p>
              Level {character.level} {character.race}
            </p>
            <p>
              {character.archetype} - {character.faction}
            </p>
            <p className='mt-2'>Epic Points: {character.epicPoints}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
