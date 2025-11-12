'use client';

import { useState } from 'react';
import { DiceRoller } from './components/DiceRoller';
import type { DiceResult } from './types';

export default function DicePage() {
  const [diceResult, setDiceResult] = useState<DiceResult | null>(null);

  const handleRoll = (
    sides: number,
    modifier: number,
    count: number
  ): DiceResult => {
    // Roll dice
    const rolls = Array.from({ length: count }, () =>
      Math.floor(Math.random() * sides + 1)
    );

    // Calculate total
    const rollsSum = rolls.reduce((sum, roll) => sum + roll, 0);
    const total = rollsSum + modifier;

    // Check for critical (all max values) and fumble (all 1s)
    const isCritical = rolls.every((roll) => roll === sides);
    const isFumble = rolls.every((roll) => roll === 1);

    // Group dice results
    const grouped = rolls.reduce(
      (acc, roll) => {
        const key = roll.toString();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );

    const result: DiceResult = {
      rolls,
      total,
      sides,
      count,
      modifier,
      isCritical,
      isFumble,
      grouped,
    };

    setDiceResult(result);
    return result;
  };

  return (
    <div className='container mx-auto py-6'>
      <h1 className='text-3xl font-bold mb-6'>Dice Roller</h1>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <DiceRoller diceResult={diceResult} onRoll={handleRoll} />
      </div>
    </div>
  );
}
