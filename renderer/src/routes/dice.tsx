import DiceRollerPage from '@/pages/dice/DicePage';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/dice')({
  component: DiceRollerPage,
});
