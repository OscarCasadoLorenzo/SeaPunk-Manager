import { createFileRoute } from '@tanstack/react-router';

function NewTaskPage() {
  return <div className='p-6'>New task page coming soon...</div>;
}

export const Route = createFileRoute('/tasks/new')({
  component: NewTaskPage,
});
