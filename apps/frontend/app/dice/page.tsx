import {
  Hydrate as HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { Suspense } from 'react';
import { DiceRoller } from './components/DiceRoller';
import { RollHistory } from './components/RollHistory';

export default async function DicePage() {
  const queryClient = new QueryClient();

  // Prefetch roll history
  await queryClient.prefetchQuery({
    queryKey: ['diceRolls'],
    queryFn: async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/dice`
      );
      return response.json();
    },
  });

  return (
    <div className='container mx-auto py-6'>
      <h1 className='text-3xl font-bold mb-6'>Dice Roller</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <HydrationBoundary state={dehydrate(queryClient)}>
          <DiceRoller />
          <Suspense fallback={<div>Loading history...</div>}>
            <RollHistory />
          </Suspense>
        </HydrationBoundary>
      </div>
    </div>
  );
}
