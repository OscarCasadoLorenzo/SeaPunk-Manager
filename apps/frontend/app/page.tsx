import { CharacterList } from '@/components/character-list';
import { Sidebar } from '@/components/sidebar';

export default function Home() {
  return (
    <div className='flex h-screen'>
      <Sidebar />
      <main className='flex-1 overflow-y-auto'>
        <div className='container py-6'>
          <h1 className='mb-8 text-3xl font-bold'>Characters</h1>
          <CharacterList />
        </div>
      </main>
    </div>
  );
}
