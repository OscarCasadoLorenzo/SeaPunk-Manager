import CombatPage from '@/pages/CombatPage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/combat')({
  component: () => <CombatPage />,
});
