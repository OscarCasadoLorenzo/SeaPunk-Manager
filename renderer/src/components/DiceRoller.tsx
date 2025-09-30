import { Button } from '@/ui/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/primitives/card';
import { Input } from '@/ui/primitives/input';
import { Dice6 } from 'lucide-react';
import { useState } from 'react';
import { DiceResult } from './types';

interface DiceRollerProps {
  diceResult: DiceResult | null;
  onRoll: (sides: number, modifier: number, count: number) => DiceResult;
}

export function DiceRoller({ diceResult, onRoll }: DiceRollerProps) {
  const [diceCount, setDiceCount] = useState(1);
  const [modifier, setModifier] = useState(0);

  const rollDice = (sides = 20) => {
    onRoll(sides, modifier, diceCount);
  };

  return (
    <Card className='clean-card'>
      <CardHeader className='pb-3'>
        <CardTitle className='text-lg flex items-center gap-2'>
          <Dice6 className='w-5 h-5 text-cyan-400' />
          Lanzador de Dados
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-3'>
        {diceResult && (
          <div className='space-y-3'>
            {/* Avisos especiales */}
            {diceResult.isCritical && (
              <div className='text-center p-3 bg-gradient-to-r from-green-600/20 to-green-500/20 border border-green-500/30 rounded-lg'>
                <div className='text-green-400 font-bold text-lg'>
                  ¡CRÍTICO!
                </div>
                <div className='text-sm text-green-300'>
                  Todos los dados obtuvieron {diceResult.sides}
                </div>
              </div>
            )}

            {diceResult.isFumble && (
              <div className='text-center p-3 bg-gradient-to-r from-red-600/20 to-red-500/20 border border-red-500/30 rounded-lg'>
                <div className='text-red-400 font-bold text-lg'>¡PIFIA!</div>
                <div className='text-sm text-red-300'>
                  Todos los dados obtuvieron 1
                </div>
              </div>
            )}

            {/* Resultado total */}
            <div className='text-center p-4 bg-gradient-to-r from-cyan-600/20 to-purple-600/20 border border-cyan-500/30 rounded-lg'>
              <div className='text-3xl font-bold text-cyan-400'>
                {diceResult.total}
              </div>
              <div className='text-sm text-cyan-300'>
                {diceResult.count}d{diceResult.sides} ={' '}
                {diceResult.rolls.reduce((sum, roll) => sum + roll, 0)}
                {modifier !== 0 && ` + ${modifier}`}
              </div>
            </div>

            {/* Resultados agrupados */}
            {diceResult.count > 1 && (
              <div className='space-y-2'>
                <div className='text-sm font-medium text-center text-muted-foreground'>
                  Resultados:
                </div>
                <div className='flex flex-wrap gap-1 justify-center'>
                  {Object.entries(diceResult.grouped)
                    .sort(([a], [b]) => Number.parseInt(b) - Number.parseInt(a))
                    .map(([value, count]) => (
                      <div
                        key={value}
                        className='px-2 py-1 bg-slate-700 rounded text-xs font-medium'
                      >
                        {value} x{count}
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Dados individuales si son pocos */}
            {diceResult.count <= 10 && diceResult.count > 1 && (
              <div className='space-y-2'>
                <div className='text-sm font-medium text-center text-muted-foreground'>
                  Tiradas individuales:
                </div>
                <div className='flex flex-wrap gap-1 justify-center'>
                  {diceResult.rolls.map((roll, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 flex items-center justify-center rounded text-xs font-bold ${
                        roll === diceResult.sides
                          ? 'bg-green-600 text-white'
                          : roll === 1
                            ? 'bg-red-600 text-white'
                            : 'bg-white text-black'
                      }`}
                    >
                      {roll}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Controles */}
        <div className='space-y-3'>
          <div className='space-y-2'>
            <label className='text-sm font-medium'>Cantidad de dados</label>
            <div className='flex items-center gap-2'>
              <Button
                size='sm'
                variant='outline'
                onClick={() => setDiceCount(Math.max(1, diceCount - 1))}
                className='w-8 h-8 p-0'
              >
                -
              </Button>
              <Input
                type='number'
                value={diceCount}
                onChange={(e) =>
                  setDiceCount(
                    Math.max(1, Number.parseInt(e.target.value) || 1)
                  )
                }
                className='clean-input text-center w-16'
                min='1'
                max='100'
              />
              <Button
                size='sm'
                variant='outline'
                onClick={() => setDiceCount(Math.min(100, diceCount + 1))}
                className='w-8 h-8 p-0'
              >
                +
              </Button>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-2'>
            <Button
              onClick={() => rollDice(20)}
              variant='outline'
              className='border-cyan-400 text-cyan-400'
            >
              d20
            </Button>
            <Button
              onClick={() => rollDice(12)}
              variant='outline'
              className='border-cyan-400 text-cyan-400'
            >
              d12
            </Button>
            <Button
              onClick={() => rollDice(10)}
              variant='outline'
              className='border-cyan-400 text-cyan-400'
            >
              d10
            </Button>
            <Button
              onClick={() => rollDice(6)}
              variant='outline'
              className='border-cyan-400 text-cyan-400'
            >
              d6
            </Button>
          </div>

          <div className='space-y-2'>
            <label className='text-sm font-medium'>Modificador</label>
            <Input
              type='number'
              value={modifier}
              onChange={(e) =>
                setModifier(Number.parseInt(e.target.value) || 0)
              }
              placeholder='0'
              className='clean-input'
            />
          </div>

          <Button
            onClick={() => rollDice(20)}
            className='w-full bg-gradient-to-r from-cyan-600 to-purple-600'
          >
            Lanzar {diceCount}d20
            {modifier !== 0 && ` + ${modifier}`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
