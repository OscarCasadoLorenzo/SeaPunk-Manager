import {
  Hydrate as HydrationBoundary,
  QueryClient,
  dehydrate,
} from '@tanstack/react-query';
import { getUserSettings } from './actions';
import { SettingsForm } from './components/SettingsForm';

export default async function SettingsPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['settings'],
    queryFn: getUserSettings,
  });

  return (
    <div className='container mx-auto py-6'>
      <h1 className='text-3xl font-bold mb-6'>Settings</h1>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <SettingsForm />
      </HydrationBoundary>
    </div>
  );
}
