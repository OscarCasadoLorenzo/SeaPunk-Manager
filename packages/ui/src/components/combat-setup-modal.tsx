'use client';

import React from 'react';

import { Sword, Users, X } from 'lucide-react';
import { Badge } from '../primitives/badge';
import { Button } from '../primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '../primitives/card';
import { Checkbox } from '../primitives/checkbox';

interface Character {
  id: string;
  playerName: string;
  characterName: string;
  type: 'PC' | 'NPC' | 'Enemy';
  isNPC: boolean;
  combat: {
    iniciativa: number;
    saludFisica: number;
    maxSaludFisica: number;
  };
}

interface CombatSetupModalProps {
  characters: Character[];
  selectedCombatants: string[];
  onSelectionChange: (selected: string[]) => void;
  onStart: () => void;
  onClose: () => void;
}

export function CombatSetupModal({
  characters,
  selectedCombatants,
  onSelectionChange,
  onStart,
  onClose,
}: CombatSetupModalProps) {
  const handleToggleCharacter = (characterId: string) => {
    if (selectedCombatants.includes(characterId)) {
      onSelectionChange(selectedCombatants.filter((id) => id !== characterId));
    } else {
      onSelectionChange([...selectedCombatants, characterId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedCombatants.length === characters.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(characters.map((c) => c.id));
    }
  };

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-background border border-border rounded-lg w-full max-w-4xl max-h-[80vh] overflow-hidden'>
        <div className='flex items-center justify-between p-4 border-b border-border'>
          <div className='flex items-center gap-2'>
            <Sword className='w-6 h-6 text-red-400' />
            <h2 className='text-2xl font-bold'>Configurar Combate</h2>
          </div>
          <Button onClick={onClose} variant='outline' size='sm'>
            <X className='w-4 h-4' />
          </Button>
        </div>

        <div className='p-6'>
          <div className='flex items-center justify-between mb-6'>
            <div className='flex items-center gap-2'>
              <Users className='w-5 h-5 text-cyan-400' />
              <h3 className='text-lg font-semibold'>
                Seleccionar Combatientes
              </h3>
              <Badge variant='outline'>
                {selectedCombatants.length} de {characters.length}
              </Badge>
            </div>
            <Button onClick={handleSelectAll} variant='outline' size='sm'>
              {selectedCombatants.length === characters.length
                ? 'Deseleccionar Todos'
                : 'Seleccionar Todos'}
            </Button>
          </div>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-[400px] overflow-y-auto'>
            {characters.map((character) => (
              <Card
                key={character.id}
                className={`cursor-pointer transition-all ${
                  selectedCombatants.includes(character.id)
                    ? 'ring-2 ring-cyan-400 bg-cyan-400/10'
                    : 'hover:bg-accent/50'
                }`}
                onClick={() => handleToggleCharacter(character.id)}
              >
                <CardHeader className='pb-2'>
                  <div className='flex items-center justify-between'>
                    <CardTitle className='text-base flex items-center gap-2'>
                      <Checkbox
                        checked={selectedCombatants.includes(character.id)}
                        onCheckedChange={() =>
                          handleToggleCharacter(character.id)
                        }
                      />
                      {character.characterName || character.playerName}
                    </CardTitle>
                    <Badge
                      variant={
                        character.type === 'PC'
                          ? 'default'
                          : character.type === 'NPC'
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {character.type}
                    </Badge>
                  </div>
                  {character.playerName && character.characterName && (
                    <p className='text-xs text-muted-foreground'>
                      Jugador: {character.playerName}
                    </p>
                  )}
                </CardHeader>
                <CardContent className='pt-0'>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span>Iniciativa Base:</span>
                      <span className='font-bold text-yellow-400'>
                        {character.combat.iniciativa}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span>Salud:</span>
                      <span className='font-bold text-red-400'>
                        {character.combat.saludFisica}/
                        {character.combat.maxSaludFisica}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span>Tipo de tirada:</span>
                      <span
                        className={`font-bold ${character.isNPC ? 'text-blue-400' : 'text-green-400'}`}
                      >
                        {character.isNPC ? 'Automática' : 'Manual'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className='flex items-center justify-between pt-4 border-t border-border'>
            <div className='text-sm text-muted-foreground'>
              <p>
                • Los NPCs tirarán iniciativa automáticamente (Iniciativa + 2d6)
              </p>
              <p>• Los PCs requerirán tirada manual del Master</p>
            </div>
            <div className='flex gap-2'>
              <Button onClick={onClose} variant='outline'>
                Cancelar
              </Button>
              <Button
                onClick={onStart}
                disabled={selectedCombatants.length < 2}
                className='bg-red-600 hover:bg-red-700'
              >
                <Sword className='w-4 h-4 mr-2' />
                Iniciar Combate
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
