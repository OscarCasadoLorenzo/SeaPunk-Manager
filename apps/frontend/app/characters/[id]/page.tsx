import { getCharacter } from '@/app/api/characters/[id]/actions';
import {
  Hydrate as HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { CharacterDetail } from './components/CharacterDetail';

interface CharacterDetailPageProps {
  params: {
    id: string;
  };
}

export default async function CharacterDetailPage({
  params,
}: CharacterDetailPageProps) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['characters', params.id],
    queryFn: () => getCharacter(params.id),
  });

  const character = await getCharacter(params.id);
  if (!character) {
    notFound();
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className='container mx-auto py-4'>
        <CharacterDetail id={params.id} />
      </div>
    </HydrationBoundary>
  );
}
