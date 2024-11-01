'use client';

import { useCharacterHealth } from '@/hooks/useCharacterHealth';
import { useCombatStats } from '@/hooks/useCombatStats';
import { Button, Input, Progress } from '@seapunk/ui';
import { useState } from 'react';

export function HealthManagementPanel({
  character,
}: HealthManagementPanelProps) {
  const [healthModifier, setHealthModifier] = useState(0);
  const characterHealth = useCharacterHealth();
  const { data: combatStats } = useCombatStats(character.id);

  const maxHealth = combatStats?.maxHealth ?? 100;
  const currentHealth = combatStats?.currentHealth ?? maxHealth;
  const healthPercentage = (currentHealth / maxHealth) * 100;

  const handleHealthChange = (amount: number) => {
    characterHealth.modifyHealth(character.id, {
      physicalHealthChange: amount,
    });
  };

  return (
    <div className='space-y-2'>
      <Progress value={healthPercentage} />
      <div className='flex items-center space-x-2'>
        <Input
          type='number'
          value={healthModifier}
          onChange={(e) => setHealthModifier(parseInt(e.target.value) || 0)}
          className='w-20'
        />
        <Button
          variant='destructive'
          size='sm'
          onClick={() => handleHealthChange(-healthModifier)}
        >
          Damage
        </Button>
        <Button
          variant='default'
          size='sm'
          onClick={() => handleHealthChange(healthModifier)}
        >
          Heal
        </Button>
      </div>
      <div className='text-sm text-muted-foreground'>
        {currentHealth} / {maxHealth} HP
      </div>
    </div>
  );
}
