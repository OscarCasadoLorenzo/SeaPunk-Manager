'use client';

import { CharacterList } from '@/components/CharacterList';
import { useQuery } from '@tanstack/react-query';

export function CharacterListWithData() {
  const { data: characters = [] } = useQuery({
    queryKey: ['characters'],
    queryFn: getCharacters,
  });

  return <CharacterList characters={characters} />;
}
