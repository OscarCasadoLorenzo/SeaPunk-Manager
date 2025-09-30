import { useCharacterHealth } from '@/hooks/useCharacterHealth';
import { Button } from '@/ui/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/primitives/card';
import { Input } from '@/ui/primitives/input';
import { Label } from '@/ui/primitives/label';
import { Heart, Minus, Plus, Zap } from 'lucide-react';
import { useState } from 'react';

interface HealthManagementPanelProps {
  characterId: string;
  characterName: string;
  currentPhysicalHealth: number;
  maxPhysicalHealth: number;
  currentMentalHealth: number;
  maxMentalHealth: number;
}

/**
 * Componente de ejemplo que demuestra el uso modular de las funciones de salud.
 * Este componente puede ser reutilizado en diferentes partes de la aplicación
 * para gestionar la salud de los personajes de forma avanzada.
 */
export function HealthManagementPanel({
  characterId,
  characterName,
  currentPhysicalHealth,
  maxPhysicalHealth,
  currentMentalHealth,
  maxMentalHealth,
}: HealthManagementPanelProps) {
  const [customPhysicalAmount, setCustomPhysicalAmount] = useState(1);
  const [customMentalAmount, setCustomMentalAmount] = useState(1);

  const {
    healPhysicalHealth,
    damagePhysicalHealth,
    healMentalHealth,
    damageMentalHealth,
    healBothHealth,
    damageBothHealth,
    setPhysicalHealth,
    setMentalHealth,
    setBothHealth,
    isLoading,
  } = useCharacterHealth({
    onSuccess: () => {
      console.log(`Health updated for ${characterName}`);
    },
    onError: (error) => {
      console.error('Error updating health:', error);
    },
  });

  return (
    <Card className='w-full max-w-md'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Heart className='w-5 h-5 text-red-400' />
          Gestión de Salud - {characterName}
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-6'>
        {/* Salud Física */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Label className='flex items-center gap-2'>
              <Heart className='w-4 h-4 text-red-400' />
              Salud Física ({currentPhysicalHealth}/{maxPhysicalHealth})
            </Label>
          </div>

          {/* Botones básicos */}
          <div className='flex gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => damagePhysicalHealth(characterId, 1)}
              disabled={isLoading || currentPhysicalHealth <= 0}
              className='flex-1'
            >
              <Minus className='w-4 h-4 mr-1' />
              -1
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => healPhysicalHealth(characterId, 1)}
              disabled={isLoading || currentPhysicalHealth >= maxPhysicalHealth}
              className='flex-1'
            >
              <Plus className='w-4 h-4 mr-1' />
              +1
            </Button>
          </div>

          {/* Cantidad personalizada */}
          <div className='flex gap-2'>
            <Input
              type='number'
              min='1'
              max='99'
              value={customPhysicalAmount}
              onChange={(e) =>
                setCustomPhysicalAmount(
                  Math.max(1, parseInt(e.target.value) || 1)
                )
              }
              className='w-20'
            />
            <Button
              size='sm'
              variant='secondary'
              onClick={() =>
                damagePhysicalHealth(characterId, customPhysicalAmount)
              }
              disabled={isLoading || currentPhysicalHealth <= 0}
              className='flex-1'
            >
              -{customPhysicalAmount}
            </Button>
            <Button
              size='sm'
              variant='secondary'
              onClick={() =>
                healPhysicalHealth(characterId, customPhysicalAmount)
              }
              disabled={isLoading || currentPhysicalHealth >= maxPhysicalHealth}
              className='flex-1'
            >
              +{customPhysicalAmount}
            </Button>
          </div>

          {/* Establecer valor absoluto */}
          <div className='flex gap-2'>
            <Input
              type='number'
              min='0'
              max={maxPhysicalHealth}
              placeholder='Valor absoluto'
              className='flex-1'
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = parseInt((e.target as HTMLInputElement).value);
                  if (!isNaN(value)) {
                    setPhysicalHealth(characterId, value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
            <Button
              size='sm'
              variant='outline'
              onClick={() => {
                const input = document.querySelector(
                  'input[placeholder="Valor absoluto"]'
                ) as HTMLInputElement;
                const value = parseInt(input.value);
                if (!isNaN(value)) {
                  setPhysicalHealth(characterId, value);
                  input.value = '';
                }
              }}
              disabled={isLoading}
            >
              Set
            </Button>
          </div>
        </div>

        {/* Salud Mental */}
        <div className='space-y-3'>
          <div className='flex items-center justify-between'>
            <Label className='flex items-center gap-2'>
              <Zap className='w-4 h-4 text-purple-400' />
              Salud Mental ({currentMentalHealth}/{maxMentalHealth})
            </Label>
          </div>

          {/* Botones básicos */}
          <div className='flex gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={() => damageMentalHealth(characterId, 1)}
              disabled={isLoading || currentMentalHealth <= 0}
              className='flex-1'
            >
              <Minus className='w-4 h-4 mr-1' />
              -1
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => healMentalHealth(characterId, 1)}
              disabled={isLoading || currentMentalHealth >= maxMentalHealth}
              className='flex-1'
            >
              <Plus className='w-4 h-4 mr-1' />
              +1
            </Button>
          </div>

          {/* Cantidad personalizada */}
          <div className='flex gap-2'>
            <Input
              type='number'
              min='1'
              max='99'
              value={customMentalAmount}
              onChange={(e) =>
                setCustomMentalAmount(
                  Math.max(1, parseInt(e.target.value) || 1)
                )
              }
              className='w-20'
            />
            <Button
              size='sm'
              variant='secondary'
              onClick={() =>
                damageMentalHealth(characterId, customMentalAmount)
              }
              disabled={isLoading || currentMentalHealth <= 0}
              className='flex-1'
            >
              -{customMentalAmount}
            </Button>
            <Button
              size='sm'
              variant='secondary'
              onClick={() => healMentalHealth(characterId, customMentalAmount)}
              disabled={isLoading || currentMentalHealth >= maxMentalHealth}
              className='flex-1'
            >
              +{customMentalAmount}
            </Button>
          </div>

          {/* Establecer valor absoluto */}
          <div className='flex gap-2'>
            <Input
              type='number'
              min='0'
              max={maxMentalHealth}
              placeholder='Valor mental absoluto'
              className='flex-1'
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  const value = parseInt((e.target as HTMLInputElement).value);
                  if (!isNaN(value)) {
                    setMentalHealth(characterId, value);
                    (e.target as HTMLInputElement).value = '';
                  }
                }
              }}
            />
            <Button
              size='sm'
              variant='outline'
              onClick={() => {
                const input = document.querySelector(
                  'input[placeholder="Valor mental absoluto"]'
                ) as HTMLInputElement;
                const value = parseInt(input.value);
                if (!isNaN(value)) {
                  setMentalHealth(characterId, value);
                  input.value = '';
                }
              }}
              disabled={isLoading}
            >
              Set
            </Button>
          </div>
        </div>

        {/* Acciones combinadas */}
        <div className='space-y-3 border-t pt-3'>
          <Label>Acciones Combinadas</Label>
          <div className='grid grid-cols-2 gap-2'>
            <Button
              size='sm'
              variant='destructive'
              onClick={() => damageBothHealth(characterId, 1, 1)}
              disabled={isLoading}
              className='w-full'
            >
              Dañar Ambas (-1/-1)
            </Button>
            <Button
              size='sm'
              variant='default'
              onClick={() => healBothHealth(characterId, 1, 1)}
              disabled={isLoading}
              className='w-full'
            >
              Curar Ambas (+1/+1)
            </Button>
          </div>
          <div className='grid grid-cols-2 gap-2'>
            <Button
              size='sm'
              variant='outline'
              onClick={() =>
                setBothHealth(characterId, maxPhysicalHealth, maxMentalHealth)
              }
              disabled={isLoading}
              className='w-full'
            >
              Curación Completa
            </Button>
            <Button
              size='sm'
              variant='outline'
              onClick={() => setBothHealth(characterId, 0, 0)}
              disabled={isLoading}
              className='w-full'
            >
              KO Total
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className='text-center text-sm text-muted-foreground'>
            Actualizando salud...
          </div>
        )}
      </CardContent>
    </Card>
  );
}
