import { createFileRoute } from '@tanstack/react-router';

function TasksPage() {
  return <div className='p-6'>Tasks page coming soon...</div>;
}

export const Route = createFileRoute('/tasks')({
  component: TasksPage,
});
