'use client';

import { Card } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';

export function RollHistory() {
  const { data: history } = useQuery({
    queryKey: ['diceRolls'],
    queryFn: async () => {
      const response = await fetch('/api/dice');
      return response.json();
    },
  });

  if (!history?.history?.length) {
    return (
      <Card className='p-6'>
        <p className='text-muted-foreground'>No rolls yet</p>
      </Card>
    );
  }

  return (
    <Card className='p-6'>
      <h2 className='text-xl font-semibold mb-4'>Roll History</h2>
      <div className='space-y-4'>
        {history.history.map((roll: any, index: number) => (
          <div key={index} className='border-b pb-2 last:border-0'>
            <p className='text-sm text-muted-foreground'>
              {new Date(roll.timestamp).toLocaleString()}
            </p>
            <p>
              Rolled {roll.count}d{roll.sides}: {roll.rolls.join(', ')}
            </p>
            <p className='font-semibold'>Total: {roll.total}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
