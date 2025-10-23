import {
  Hydrate as HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { getNarratives } from './actions';
import { DJPanel } from './components/DJPanel';

export default async function DJPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['narratives'],
    queryFn: getNarratives,
  });

  return (
    <div className='container mx-auto py-6'>
      <h1 className='text-3xl font-bold mb-6'>DJ Panel</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <DJPanel />
      </HydrationBoundary>
    </div>
  );
}
