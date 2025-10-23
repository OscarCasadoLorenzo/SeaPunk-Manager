import { CharacterList } from '@/components/CharacterList';
import { CreateCharacterButton } from './components/CreateCharacterButton';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';

export default async function CharactersPage() {
  const characters = await getCharacters();

  return (
    <div className='container mx-auto py-4'>
      <div className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-bold'>Characters</h1>
        <CreateCharacterButton />
      </div>
      <CharacterList characters={characters} />
    </div>
  );
}
