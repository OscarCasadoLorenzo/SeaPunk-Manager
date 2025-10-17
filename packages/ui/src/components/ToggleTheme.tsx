import { Moon } from 'lucide-react';
import { toggleTheme } from '../helpers/theme_helpers';
import { Button } from '../primitives/button';

export function ToggleTheme() {
  return (
    <Button onClick={toggleTheme} size="icon">
      <Moon size={16} />
    </Button>
  );
}
