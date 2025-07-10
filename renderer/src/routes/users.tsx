import { createFileRoute } from '@tanstack/react-router';

function UsersPage() {
  return <div className='p-6'>Users page coming soon...</div>;
}

export const Route = createFileRoute('/users')({
  component: UsersPage,
});
