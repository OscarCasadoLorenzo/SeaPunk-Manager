import { Sidebar } from '@/components/Sidebar';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Toaster } from 'react-hot-toast';

export const Route = createRootRoute({
  component: () => (
    <div className='flex h-screen bg-gray-100'>
      <Sidebar />
      <main className='flex-1 overflow-auto'>
        <Outlet />
      </main>
      <Toaster
        position='top-right'
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </div>
  ),
});
