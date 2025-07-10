import { Sidebar } from '@/components/Sidebar';
import { Dashboard } from '@/pages/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './index.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className='flex h-screen bg-gray-100'>
          <Sidebar />
          <main className='flex-1 overflow-auto'>
            <Routes>
              <Route path='/' element={<Dashboard />} />
              <Route
                path='/users'
                element={<div className='p-6'>Users page coming soon...</div>}
              />
              <Route
                path='/tasks'
                element={<div className='p-6'>Tasks page coming soon...</div>}
              />
              <Route
                path='/tasks/new'
                element={
                  <div className='p-6'>New task page coming soon...</div>
                }
              />
            </Routes>
          </main>
        </div>
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
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
