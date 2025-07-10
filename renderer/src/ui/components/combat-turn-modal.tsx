'use client';

import React, { useState } from 'react';

import {
  ChevronRight,
  Clock,
  Dice6,
  Sword,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';
import { Badge } from '../primitives/badge';
import { Button } from '../primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '../primitives/card';
import { Input } from '../primitives/input';
import { Label } from '../primitives/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../primitives/select';
import { Separator } from '../primitives/separator';

interface Character {
  id: string;
  playerName: string;
  characterName: string;
  type: 'PC' | 'NPC' | 'Enemy';
  isNPC: boolean;
  combat: {
    iniciativa: number;
    ataque: number;
    defensa: number;
    impacto: number;
    danoMaximo: number;
    resistenciaFisica: number;
    saludFisica: number;
    maxSaludFisica: number;
  };
}

interface CombatParticipant {
  character: Character;
  initiative: number;
  initiativeRoll: number;
  isActive: boolean;
  hasActed: boolean;
}

interface CombatAction {
  type: 'attack' | 'defend' | 'other';
  attacker?: string;
  target?: string;
  attackRoll?: number;
  defenseValue?: number;
  impactRoll?: number;
  damageRoll?: number[];
  finalDamage?: number;
  description: string;
}

interface CombatState {
  participants: CombatParticipant[];
  currentTurnIndex: number;
  round: number;
  phase: 'setup' | 'initiative' | 'combat' | 'ended';
  actions: CombatAction[];
}

interface CombatTurnModalProps {
  combatState: CombatState;
  onAttack: (
    attackerId: string,
    targetId: string,
    attackRoll: number,
    bonuses: number
  ) => void;
  onNextTurn: () => void;
  onClose: () => void;
}

export function CombatTurnModal({
  combatState,
  onAttack,
  onNextTurn,
  onClose,
}: CombatTurnModalProps) {
  const [actionType, setActionType] = useState<'attack' | 'other'>('attack');
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [attackRoll, setAttackRoll] = useState<number>(0);
  const [bonuses, setBonuses] = useState<number>(0);
  const [manualInitiative, setManualInitiative] = useState<{
    [key: string]: number;
  }>({});

  const currentParticipant =
    combatState.participants[combatState.currentTurnIndex];
  const availableTargets = combatState.participants.filter(
    (p) => p.character.id !== currentParticipant?.character.id && p.isActive
  );

  // Manejar iniciativa manual para PCs
  const handleSetInitiative = (characterId: string, initiative: number) => {
    setManualInitiative((prev) => ({ ...prev, [characterId]: initiative }));
  };

  const handleProcessAttack = () => {
    if (!selectedTarget || attackRoll === 0) return;

    onAttack(
      currentParticipant.character.id,
      selectedTarget,
      attackRoll,
      bonuses
    );

    // Reset form
    setSelectedTarget('');
    setAttackRoll(0);
    setBonuses(0);
  };

  // Si estamos en fase de iniciativa y hay PCs sin iniciativa
  const needsInitiativeRolls =
    combatState.phase === 'initiative' &&
    combatState.participants.some(
      (p) => !p.character.isNPC && p.initiative === 0
    );

  if (needsInitiativeRolls) {
    return (
      <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
        <div className='bg-background border border-border rounded-lg w-full max-w-3xl max-h-[80vh] overflow-hidden'>
          <div className='flex items-center justify-between p-4 border-b border-border'>
            <div className='flex items-center gap-2'>
              <Dice6 className='w-6 h-6 text-yellow-400' />
              <h2 className='text-2xl font-bold'>Tiradas de Iniciativa</h2>
            </div>
            <Button onClick={onClose} variant='outline' size='sm'>
              <X className='w-4 h-4' />
            </Button>
          </div>

          <div className='p-6'>
            <p className='text-muted-foreground mb-6'>
              Introduce las tiradas de iniciativa para los personajes jugadores
              (Iniciativa base + 2d6):
            </p>

            <div className='space-y-4'>
              {combatState.participants
                .filter((p) => !p.character.isNPC)
                .map((participant) => (
                  <Card key={participant.character.id} className='clean-card'>
                    <CardContent className='p-4'>
                      <div className='flex items-center justify-between'>
                        <div>
                          <h3 className='font-semibold'>
                            {participant.character.characterName ||
                              participant.character.playerName}
                          </h3>
                          <p className='text-sm text-muted-foreground'>
                            Iniciativa base:{' '}
                            {participant.character.combat.iniciativa} + 2d6
                          </p>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Label htmlFor={`init-${participant.character.id}`}>
                            Total:
                          </Label>
                          <Input
                            id={`init-${participant.character.id}`}
                            type='number'
                            value={
                              manualInitiative[participant.character.id] || ''
                            }
                            onChange={(e) =>
                              handleSetInitiative(
                                participant.character.id,
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                            className='w-20'
                            placeholder='0'
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>

            <div className='flex justify-end gap-2 mt-6'>
              <Button onClick={onClose} variant='outline'>
                Cancelar
              </Button>
              <Button
                onClick={() => {
                  // Aplicar iniciativas manuales y continuar
                  // Esta lógica debería estar en el componente padre
                  onNextTurn();
                }}
                className='bg-yellow-600 hover:bg-yellow-700'
              >
                Continuar al Combate
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentParticipant) return null;

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4'>
      <div className='bg-background border border-border rounded-lg w-full max-w-5xl max-h-[90vh] overflow-hidden'>
        <div className='flex items-center justify-between p-4 border-b border-border'>
          <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <Sword className='w-6 h-6 text-red-400' />
              <h2 className='text-2xl font-bold'>Turno de Combate</h2>
            </div>
            <Badge
              variant='outline'
              className='border-yellow-400 text-yellow-400'
            >
              Ronda {combatState.round}
            </Badge>
          </div>
          <Button onClick={onClose} variant='outline' size='sm'>
            <X className='w-4 h-4' />
          </Button>
        </div>

        <div className='grid grid-cols-12 gap-4 p-6 max-h-[calc(90vh-80px)] overflow-y-auto'>
          {/* Panel izquierdo - Orden de iniciativa */}
          <div className='col-span-4 space-y-4'>
            <Card className='clean-card'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Clock className='w-5 h-5 text-yellow-400' />
                  Orden de Iniciativa
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                {combatState.participants.map((participant, index) => (
                  <div
                    key={participant.character.id}
                    className={`p-3 rounded-lg border ${
                      index === combatState.currentTurnIndex
                        ? 'bg-yellow-400/20 border-yellow-400'
                        : 'bg-slate-700/50 border-slate-600'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <div>
                        <div className='font-medium'>
                          {participant.character.characterName ||
                            participant.character.playerName}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          {participant.character.type}
                        </div>
                      </div>
                      <div className='text-right'>
                        <div className='font-bold text-yellow-400'>
                          {participant.initiative}
                        </div>
                        <div className='text-xs text-muted-foreground'>
                          ({participant.character.combat.iniciativa} +{' '}
                          {participant.initiativeRoll})
                        </div>
                      </div>
                    </div>
                    {index === combatState.currentTurnIndex && (
                      <div className='mt-2 flex items-center gap-1 text-xs text-yellow-400'>
                        <ChevronRight className='w-3 h-3' />
                        Turno actual
                      </div>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Historial de acciones */}
            <Card className='clean-card'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>Historial</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2 max-h-[200px] overflow-y-auto'>
                {combatState.actions.slice(-5).map((action, index) => (
                  <div
                    key={index}
                    className='p-2 bg-slate-700/50 rounded text-sm'
                  >
                    {action.description}
                  </div>
                ))}
                {combatState.actions.length === 0 && (
                  <p className='text-muted-foreground text-sm'>
                    No hay acciones aún
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel central - Personaje actual */}
          <div className='col-span-4 space-y-4'>
            <Card className='clean-card border-yellow-400'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <Target className='w-5 h-5 text-yellow-400' />
                  {currentParticipant.character.characterName ||
                    currentParticipant.character.playerName}
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='grid grid-cols-2 gap-4'>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span>Ataque:</span>
                      <span className='font-bold text-red-400'>
                        {currentParticipant.character.combat.ataque}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span>Defensa:</span>
                      <span className='font-bold text-blue-400'>
                        {currentParticipant.character.combat.defensa}
                      </span>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <div className='flex justify-between text-sm'>
                      <span>Impacto:</span>
                      <span className='font-bold text-purple-400'>
                        {currentParticipant.character.combat.impacto}
                      </span>
                    </div>
                    <div className='flex justify-between text-sm'>
                      <span>Daño Máx:</span>
                      <span className='font-bold text-orange-400'>
                        {currentParticipant.character.combat.danoMaximo}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Acciones de combate */}
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label>Tipo de Acción</Label>
                    <Select
                      value={actionType}
                      onValueChange={(value: 'attack' | 'other') =>
                        setActionType(value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='attack'>Atacar</SelectItem>
                        <SelectItem value='other'>Otra Acción</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {actionType === 'attack' && (
                    <div className='space-y-4'>
                      <div className='space-y-2'>
                        <Label>Objetivo</Label>
                        <Select
                          value={selectedTarget}
                          onValueChange={setSelectedTarget}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder='Seleccionar objetivo' />
                          </SelectTrigger>
                          <SelectContent>
                            {availableTargets.map((target) => (
                              <SelectItem
                                key={target.character.id}
                                value={target.character.id}
                              >
                                {target.character.characterName ||
                                  target.character.playerName}
                                (DEF: {target.character.combat.defensa})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        <div className='space-y-2'>
                          <Label>Tirada de Ataque (d20)</Label>
                          <Input
                            type='number'
                            value={attackRoll || ''}
                            onChange={(e) =>
                              setAttackRoll(
                                Number.parseInt(e.target.value) || 0
                              )
                            }
                            placeholder='1-20'
                            min='1'
                            max='20'
                          />
                        </div>
                        <div className='space-y-2'>
                          <Label>Bonificadores</Label>
                          <Input
                            type='number'
                            value={bonuses || ''}
                            onChange={(e) =>
                              setBonuses(Number.parseInt(e.target.value) || 0)
                            }
                            placeholder='±0'
                          />
                        </div>
                      </div>

                      {selectedTarget && attackRoll > 0 && (
                        <div className='p-3 bg-slate-700/50 rounded-lg'>
                          <div className='text-sm space-y-1'>
                            <div className='flex justify-between'>
                              <span>Ataque Total:</span>
                              <span className='font-bold'>
                                {currentParticipant.character.combat.ataque} +{' '}
                                {attackRoll} + {bonuses} ={' '}
                                <span className='text-red-400'>
                                  {currentParticipant.character.combat.ataque +
                                    attackRoll +
                                    bonuses}
                                </span>
                              </span>
                            </div>
                            <div className='flex justify-between'>
                              <span>Defensa Objetivo:</span>
                              <span className='font-bold text-blue-400'>
                                {
                                  availableTargets.find(
                                    (t) => t.character.id === selectedTarget
                                  )?.character.combat.defensa
                                }
                              </span>
                            </div>
                            <Separator className='my-2' />
                            <div className='flex justify-between font-bold'>
                              <span>Resultado:</span>
                              <span
                                className={
                                  currentParticipant.character.combat.ataque +
                                    attackRoll +
                                    bonuses >
                                  (availableTargets.find(
                                    (t) => t.character.id === selectedTarget
                                  )?.character.combat.defensa || 0)
                                    ? 'text-green-400'
                                    : 'text-red-400'
                                }
                              >
                                {currentParticipant.character.combat.ataque +
                                  attackRoll +
                                  bonuses >
                                (availableTargets.find(
                                  (t) => t.character.id === selectedTarget
                                )?.character.combat.defensa || 0)
                                  ? 'IMPACTA'
                                  : 'FALLA'}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}

                      <Button
                        onClick={handleProcessAttack}
                        disabled={!selectedTarget || attackRoll === 0}
                        className='w-full bg-red-600 hover:bg-red-700'
                      >
                        <Sword className='w-4 h-4 mr-2' />
                        Ejecutar Ataque
                      </Button>
                    </div>
                  )}

                  {actionType === 'other' && (
                    <div className='space-y-4'>
                      <Textarea
                        placeholder='Describe la acción realizada...'
                        className='min-h-[100px]'
                      />
                      <Button className='w-full'>Ejecutar Acción</Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Panel derecho - Tabla de impacto y objetivos */}
          <div className='col-span-4 space-y-4'>
            <Card className='clean-card'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg flex items-center gap-2'>
                  <TrendingUp className='w-5 h-5 text-purple-400' />
                  Tabla de Impacto
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-2 text-xs'>
                  <div className='grid grid-cols-2 gap-2 font-bold border-b pb-1'>
                    <span>Impacto</span>
                    <span>Dados</span>
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <span>{'< 10'}</span>
                    <span>1D6</span>
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <span>11-16</span>
                    <span>2D6</span>
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <span>17-22</span>
                    <span>3D6</span>
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <span>23-26</span>
                    <span>4D6</span>
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <span>27-30</span>
                    <span>5D6</span>
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <span>31-34</span>
                    <span>6D6</span>
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <span>35-37</span>
                    <span>7D6</span>
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <span>38-40</span>
                    <span>8D6</span>
                  </div>
                  <div className='grid grid-cols-2 gap-2'>
                    <span>{'> 40'}</span>
                    <span>9D6</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className='clean-card'>
              <CardHeader className='pb-3'>
                <CardTitle className='text-lg'>Objetivos Disponibles</CardTitle>
              </CardHeader>
              <CardContent className='space-y-2'>
                {availableTargets.map((target) => (
                  <div
                    key={target.character.id}
                    className='p-2 bg-slate-700/50 rounded'
                  >
                    <div className='font-medium text-sm'>
                      {target.character.characterName ||
                        target.character.playerName}
                    </div>
                    <div className='text-xs text-muted-foreground grid grid-cols-2 gap-2 mt-1'>
                      <span>DEF: {target.character.combat.defensa}</span>
                      <span>
                        RES: {target.character.combat.resistenciaFisica}
                      </span>
                    </div>
                    <div className='w-full bg-slate-600 rounded-full h-1 mt-2'>
                      <div
                        className='bg-red-400 h-1 rounded-full'
                        style={{
                          width: `${(target.character.combat.saludFisica / target.character.combat.maxSaludFisica) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className='flex items-center justify-between p-4 border-t border-border'>
          <div className='text-sm text-muted-foreground'>
            Turno de{' '}
            <span className='font-bold text-yellow-400'>
              {currentParticipant.character.characterName ||
                currentParticipant.character.playerName}
            </span>{' '}
            - Ronda {combatState.round}
          </div>
          <div className='flex gap-2'>
            <Button onClick={onClose} variant='outline'>
              Cerrar
            </Button>
            <Button
              onClick={onNextTurn}
              className='bg-green-600 hover:bg-green-700'
            >
              <ChevronRight className='w-4 h-4 mr-2' />
              Siguiente Turno
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
