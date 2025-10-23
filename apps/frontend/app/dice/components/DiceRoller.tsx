'use client';

import { Button, Card, Input, Label } from '@seapunk/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';

export function DiceRoller() {
  const queryClient = useQueryClient();
  const [count, setCount] = useState(1);
  const [sides, setSides] = useState(6);

  const rollMutation = useMutation({
    mutationFn: async ({ count, sides }: { count: number; sides: number }) => {
      const response = await fetch('/api/dice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count, sides }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['diceRolls'] });
    },
  });

  const handleRoll = () => {
    rollMutation.mutate({ count, sides });
  };

  return (
    <Card className='p-6'>
      <div className='space-y-4'>
        <div className='grid grid-cols-2 gap-4'>
          <div className='space-y-2'>
            <Label htmlFor='count'>Number of Dice</Label>
            <Input
              id='count'
              type='number'
              min={1}
              max={10}
              value={count}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setCount(parseInt(e.target.value) || 1)
              }
              className='bg-gray-800 text-white'
            />
          </div>
          <div className='space-y-2'>
            <Label htmlFor='sides'>Sides per Die</Label>
            <Input
              id='sides'
              type='number'
              min={2}
              value={sides}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSides(parseInt(e.target.value) || 6)
              }
              className='bg-gray-800 text-white'
            />
          </div>
        </div>
        <Button
          onClick={handleRoll}
          disabled={rollMutation.isPending}
          className='w-full'
        >
          {rollMutation.isPending ? 'Rolling...' : 'Roll Dice'}
        </Button>
        {rollMutation.data && (
          <div className='mt-4'>
            <h3 className='font-semibold mb-2'>Results:</h3>
            <p>Rolls: {rollMutation.data.rolls.join(', ')}</p>
            <p className='font-bold'>Total: {rollMutation.data.total}</p>
          </div>
        )}
      </div>
    </Card>
  );
}
