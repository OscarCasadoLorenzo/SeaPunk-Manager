import {
  Hydrate as HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { getCombatState } from './actions';
import { CombatInterface } from './components/CombatInterface';

export default async function CombatPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['combat'],
    queryFn: getCombatState,
  });

  return (
    <div className='container mx-auto py-6'>
      <h1 className='text-3xl font-bold mb-6'>Combat Tracker</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CombatInterface />
      </HydrationBoundary>
    </div>
  );
}
