'use client';

import { CharacterList } from '@/components/character-list';

export default function Home() {
  return (
    <div className='container py-6'>
      <h1 className='mb-8 text-3xl font-bold'>Characters</h1>
      <CharacterList />
    </div>
  );
}
