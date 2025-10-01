import { CharacterProvider } from '@/contexts/CharacterContext';
import CharacterList from '@/pages/characters/CharacterList';
import { RefactoredCharacterInfoPage } from '@/pages/characters/detail';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

const searchSchema = z.object({
  characterId: z.string().optional(),
});

export const Route = createFileRoute('/characters')({
  component: RouteComponent,
  validateSearch: searchSchema,
});

function RouteComponent() {
  const { characterId } = Route.useSearch();

  return (
    <CharacterProvider initialCharacterId={characterId}>
      <div className='flex h-screen'>
        <div className='w-[30%] h-full'>
          <CharacterList />
        </div>
        <div className='flex-1 h-full'>
          <RefactoredCharacterInfoPage />
        </div>
      </div>
    </CharacterProvider>
  );
}
