import { Button, Card, CardContent, CardHeader, CardTitle, Input } from '@/ui';
import { Dice6, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface DiceResult {
  total: number;
  rolls: number[];
  grouped: { [key: number]: number };
  sides: number;
  count: number;
  isCritical: boolean;
  isFumble: boolean;
}

function DiceRollerPage() {
  const [diceCount, setDiceCount] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [diceResult, setDiceResult] = useState<DiceResult | null>(null);
  const [customSides, setCustomSides] = useState(20);

  const rollDice = (sides = 20, description?: string) => {
    const rolls: number[] = [];
    for (let i = 0; i < diceCount; i++) {
      rolls.push(Math.floor(Math.random() * sides) + 1);
    }

    const total = rolls.reduce((sum, roll) => sum + roll, 0) + modifier;

    // Group results
    const grouped: { [key: number]: number } = {};
    rolls.forEach((roll) => {
      grouped[roll] = (grouped[roll] || 0) + 1;
    });

    // Detect criticals and fumbles
    const isCritical = diceCount > 1 && rolls.every((roll) => roll === sides);
    const isFumble = diceCount > 1 && rolls.every((roll) => roll === 1);

    const result: DiceResult = {
      total,
      rolls,
      grouped,
      sides,
      count: diceCount,
      isCritical,
      isFumble,
    };

    setDiceResult(result);

    return result;
  };

  return (
    <div className='min-h-screen bg-slate-900'>
      <div className='container mx-auto p-6'>
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-3'>
              <div className='p-2 bg-slate-800 rounded-lg border border-slate-700'>
                <Dice6 className='w-8 h-8 text-cyan-400' />
              </div>
              <div>
                <h1 className='text-3xl font-bold text-white'>
                  Lanzador de Dados
                </h1>
                <p className='text-slate-400'>
                  Sistema avanzado de dados para SeaPunk
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Main Dice Roller */}
          <div className='lg:col-span-2'>
            <Card className='bg-slate-800 border-slate-700'>
              <CardHeader className='pb-4'>
                <CardTitle className='text-2xl flex items-center gap-3'>
                  <Sparkles className='w-6 h-6 text-yellow-400' />
                  Configuración de Tirada
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* Current Result Display */}
                {diceResult && (
                  <div className='space-y-4'>
                    {/* Special Notifications */}
                    {diceResult.isCritical && (
                      <div className='text-center p-4 bg-emerald-800 border border-emerald-600 rounded-xl'>
                        <div className='text-emerald-300 font-bold text-2xl flex items-center justify-center gap-2'>
                          <Sparkles className='w-6 h-6' />
                          ¡ÉXITO CRÍTICO!
                          <Sparkles className='w-6 h-6' />
                        </div>
                        <div className='text-sm text-emerald-400 mt-1'>
                          Todos los dados obtuvieron {diceResult.sides}
                        </div>
                      </div>
                    )}

                    {diceResult.isFumble && (
                      <div className='text-center p-4 bg-red-800 border border-red-600 rounded-xl'>
                        <div className='text-red-300 font-bold text-2xl'>
                          ¡PIFIA CRÍTICA!
                        </div>
                        <div className='text-sm text-red-400 mt-1'>
                          Todos los dados obtuvieron 1
                        </div>
                      </div>
                    )}

                    {/* Total Result */}
                    <div className='text-center p-6 bg-slate-700 border border-slate-600 rounded-xl'>
                      <div className='text-5xl font-bold text-cyan-400 mb-2'>
                        {diceResult.total}
                      </div>
                      <div className='text-lg text-slate-300'>
                        {diceResult.count}d{diceResult.sides} ={' '}
                        {diceResult.rolls.reduce((sum, roll) => sum + roll, 0)}
                        {modifier !== 0 && (
                          <span
                            className={
                              modifier > 0 ? 'text-green-400' : 'text-red-400'
                            }
                          >
                            {modifier > 0 ? ' + ' : ' - '}
                            {Math.abs(modifier)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Individual Dice Results */}
                    {diceResult.count <= 20 && diceResult.count > 1 && (
                      <div className='space-y-3'>
                        <div className='text-lg font-semibold text-center text-slate-300'>
                          Resultados Individuales
                        </div>
                        <div className='flex flex-wrap gap-2 justify-center'>
                          {diceResult.rolls.map((roll, index) => (
                            <div
                              key={index}
                              className={`w-12 h-12 flex items-center justify-center rounded-lg text-sm font-bold transition-all duration-200 ${
                                roll === diceResult.sides
                                  ? 'bg-emerald-700 text-white border border-emerald-500'
                                  : roll === 1
                                    ? 'bg-red-700 text-white border border-red-500'
                                    : 'bg-slate-600 text-slate-200 border border-slate-500'
                              }`}
                            >
                              {roll}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Grouped Results for many dice */}
                    {diceResult.count > 20 && (
                      <div className='space-y-3'>
                        <div className='text-lg font-semibold text-center text-slate-300'>
                          Resultados Agrupados
                        </div>
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2'>
                          {Object.entries(diceResult.grouped)
                            .sort(
                              ([a], [b]) =>
                                Number.parseInt(b) - Number.parseInt(a)
                            )
                            .map(([value, count]) => (
                              <div
                                key={value}
                                className='p-3 bg-slate-700 rounded-lg text-center border border-slate-600'
                              >
                                <div className='text-lg font-bold text-cyan-400'>
                                  {value}
                                </div>
                                <div className='text-xs text-slate-400'>
                                  ×{count}
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Dice Configuration */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Dice Count */}
                  <div className='space-y-3'>
                    <label className='text-lg font-semibold text-slate-200'>
                      Cantidad de Dados
                    </label>
                    <div className='flex items-center gap-3'>
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() => setDiceCount(Math.max(1, diceCount - 1))}
                        className='w-10 h-10 p-0 border-slate-600 hover:border-cyan-400 hover:text-cyan-400'
                      >
                        -
                      </Button>
                      <Input
                        type='number'
                        value={diceCount}
                        onChange={(e) =>
                          setDiceCount(
                            Math.max(
                              1,
                              Math.min(
                                100,
                                Number.parseInt(e.target.value) || 1
                              )
                            )
                          )
                        }
                        className='text-center text-lg font-semibold bg-slate-800 border-slate-600 focus:border-cyan-400 text-white'
                        min='1'
                        max='100'
                      />
                      <Button
                        size='sm'
                        variant='outline'
                        onClick={() =>
                          setDiceCount(Math.min(100, diceCount + 1))
                        }
                        className='w-10 h-10 p-0 border-slate-600 hover:border-cyan-400 hover:text-cyan-400'
                      >
                        +
                      </Button>
                    </div>
                  </div>

                  {/* Modifier */}
                  <div className='space-y-3'>
                    <label className='text-lg font-semibold text-slate-200'>
                      Modificador
                    </label>
                    <Input
                      type='number'
                      value={modifier}
                      onChange={(e) =>
                        setModifier(Number.parseInt(e.target.value) || 0)
                      }
                      placeholder='0'
                      className='text-center text-lg font-semibold bg-slate-800 border-slate-600 focus:border-cyan-400 text-white'
                    />
                  </div>
                </div>

                {/* Preset Dice Buttons */}
                <div className='space-y-4'>
                  <div className='text-lg font-semibold text-slate-200'>
                    Dados Rápidos
                  </div>
                  <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                    {[
                      {
                        sides: 20,
                        color: 'bg-cyan-600 hover:bg-cyan-700',
                        name: 'd20',
                      },
                      {
                        sides: 12,
                        color: 'bg-purple-600 hover:bg-purple-700',
                        name: 'd12',
                      },
                      {
                        sides: 10,
                        color: 'bg-emerald-600 hover:bg-emerald-700',
                        name: 'd10',
                      },
                      {
                        sides: 6,
                        color: 'bg-orange-600 hover:bg-orange-700',
                        name: 'd6',
                      },
                    ].map(({ sides, color, name }) => (
                      <Button
                        key={sides}
                        onClick={() => rollDice(sides, name)}
                        className={`${color} hover:scale-105 transition-all duration-200 font-bold text-white`}
                      >
                        {name}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Dice */}
                <div className='space-y-4'>
                  <div className='text-lg font-semibold text-slate-200'>
                    Dado Personalizado
                  </div>
                  <div className='flex gap-3'>
                    <Input
                      type='number'
                      value={customSides}
                      onChange={(e) =>
                        setCustomSides(
                          Math.max(2, Number.parseInt(e.target.value) || 2)
                        )
                      }
                      placeholder='Caras'
                      className='bg-slate-800 border-slate-600 focus:border-cyan-400 text-white'
                      min='2'
                    />
                    <Button
                      onClick={() => rollDice(customSides, `d${customSides}`)}
                      variant='outline'
                      className='border-slate-600 hover:border-cyan-400 hover:text-cyan-400'
                    >
                      Lanzar d{customSides}
                    </Button>
                  </div>
                </div>

                {/* Main Roll Button */}
                <Button
                  onClick={() => rollDice(20)}
                  className='w-full h-14 text-xl font-bold bg-cyan-600 hover:bg-cyan-700 transition-all duration-200'
                >
                  <Dice6 className='w-6 h-6 mr-3' />
                  Lanzar {diceCount}d20
                  {modifier !== 0 && ` ${modifier > 0 ? '+' : ''}${modifier}`}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
export default DiceRollerPage;
