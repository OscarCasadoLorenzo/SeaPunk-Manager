// Componente principal de la interfaz de combate
import {
  CombatAction,
  CombatActionType,
  CombatCharacter,
  CombatSide,
  CombatState,
  InitiativeEntry,
} from '@/types/combat';
import { Badge } from '@/ui/primitives/badge';
import { Button } from '@/ui/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/primitives/card';
import { ScrollArea } from '@/ui/primitives/scroll-area';
import { Separator } from '@/ui/primitives/separator';
import { CombatManager } from '@/utils/CombatManager';
import { Brain, Heart, Shield, Sword, Users } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CombatInterfaceProps {
  initialCharacters: CombatCharacter[];
  onCombatEnd: (winner?: CombatSide) => void;
  djMode?: boolean;
}

export function CombatInterface({
  initialCharacters,
  onCombatEnd,
  djMode = false,
}: CombatInterfaceProps) {
  const [combatManager] = useState(
    () =>
      new CombatManager({
        useSameRollForInitiativeAndAttack: true,
        allowSimultaneousActions: true,
        autoDecayEffects: true,
        djModeEnabled: djMode,
      })
  );

  const [combatState, setCombatState] = useState<CombatState | null>(null);
  const [selectedAction, setSelectedAction] = useState<CombatActionType | null>(
    null
  );
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [actionDescription, setActionDescription] = useState<string>('');

  useEffect(() => {
    // Inicializar combate al montar el componente
    const characterSides: Record<string, CombatSide> = {};
    initialCharacters.forEach((char) => {
      characterSides[char.id] = char.side;
    });

    const initialState = combatManager.initiateCombat(
      initialCharacters.map((char) => ({ ...char, side: char.side })),
      characterSides
    );

    setCombatState(initialState);
  }, [initialCharacters, combatManager]);

  useEffect(() => {
    // Verificar si el combate ha terminado
    if (combatState && !combatState.isActive) {
      onCombatEnd(combatState.winner);
    }
  }, [combatState, onCombatEnd]);

  const handleAction = async () => {
    if (!selectedAction || !combatState) return;

    const currentActor = combatManager.getCurrentActor();
    if (!currentActor) return;

    const action: CombatAction = {
      type: selectedAction,
      actorId: currentActor.id,
      options: {
        targetId: selectedTarget || undefined,
        description: actionDescription || undefined,
      },
    };

    try {
      await combatManager.processTurn(action);
      setCombatState(combatManager.getCombatState());

      // Limpiar selección
      setSelectedAction(null);
      setSelectedTarget(null);
      setActionDescription('');
    } catch (error) {
      console.error('Error procesando turno:', error);
    }
  };

  const getCurrentActor = (): CombatCharacter | null => {
    return combatManager.getCurrentActor();
  };

  const getAvailableTargets = (): CombatCharacter[] => {
    if (!combatState) return [];

    const currentActor = getCurrentActor();
    if (!currentActor) return [];

    // Para ataques, solo enemigos. Para otras acciones, aliados también
    if (selectedAction === CombatActionType.ATACAR) {
      return combatState.participants.filter(
        (char) =>
          char.side !== currentActor.side && char.currentPhysicalHealth > 0
      );
    }

    return combatState.participants.filter(
      (char) => char.id !== currentActor.id && char.currentPhysicalHealth > 0
    );
  };

  if (!combatState) {
    return <div>Inicializando combate...</div>;
  }

  const currentActor = getCurrentActor();

  return (
    <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 p-4'>
      {/* Panel de orden de iniciativa */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Orden de Iniciativa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='space-y-2'>
            {combatState.turnContext.initiativeOrder.map((entry, index) => (
              <InitiativeCard
                key={entry.characterId}
                entry={entry}
                isActive={index === combatState.turnContext.currentActorIndex}
                position={index + 1}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Panel principal de acción */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentActor
              ? `Turno de ${currentActor.characterName}`
              : 'Combate Terminado'}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {currentActor && (
            <>
              {/* Estado del personaje actual */}
              <CharacterStatusCard character={currentActor} />

              <Separator />

              {/* Selección de acción */}
              <div className='space-y-2'>
                <h4 className='font-semibold'>Seleccionar Acción:</h4>
                <div className='grid grid-cols-2 gap-2'>
                  {Object.values(CombatActionType).map((actionType) => (
                    <Button
                      key={actionType}
                      variant={
                        selectedAction === actionType ? 'default' : 'outline'
                      }
                      size='sm'
                      onClick={() => setSelectedAction(actionType)}
                      className='text-xs'
                    >
                      {getActionLabel(actionType)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Selección de objetivo */}
              {selectedAction && needsTarget(selectedAction) && (
                <div className='space-y-2'>
                  <h4 className='font-semibold'>Seleccionar Objetivo:</h4>
                  <div className='space-y-1'>
                    {getAvailableTargets().map((target) => (
                      <Button
                        key={target.id}
                        variant={
                          selectedTarget === target.id ? 'default' : 'outline'
                        }
                        size='sm'
                        onClick={() => setSelectedTarget(target.id)}
                        className='w-full justify-start'
                      >
                        <span
                          className={`w-2 h-2 rounded-full mr-2 ${getSideColor(target.side)}`}
                        />
                        {target.characterName}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Ejecutar acción */}
              <Button
                onClick={handleAction}
                disabled={
                  !selectedAction ||
                  (needsTarget(selectedAction) && !selectedTarget)
                }
                className='w-full'
              >
                Ejecutar Acción
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Panel de estado general y log */}
      <Card>
        <CardHeader>
          <CardTitle>Estado del Combate</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          {/* Información general */}
          <div className='text-sm space-y-1'>
            <div>Ronda: {combatState.turnContext.roundId}</div>
            <div>Asalto: {combatState.turnContext.assaultNum}</div>
            <div>Estado: {combatState.isActive ? 'Activo' : 'Terminado'}</div>
          </div>

          <Separator />

          {/* Lista de participantes */}
          <div className='space-y-2'>
            <h4 className='font-semibold'>Participantes:</h4>
            {combatState.participants.map((participant) => (
              <ParticipantStatusCard
                key={participant.id}
                character={participant}
              />
            ))}
          </div>

          <Separator />

          {/* Log de eventos */}
          <div className='space-y-2'>
            <h4 className='font-semibold'>Log de Combate:</h4>
            <ScrollArea className='h-32'>
              <div className='space-y-1 text-xs'>
                {combatState.turnContext.eventLog
                  .slice(-10)
                  .map((event, index) => (
                    <div
                      key={index}
                      className='p-1 bg-muted rounded text-muted-foreground'
                    >
                      {event}
                    </div>
                  ))}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para mostrar entrada de iniciativa
function InitiativeCard({
  entry,
  isActive,
  position,
}: {
  entry: InitiativeEntry;
  isActive: boolean;
  position: number;
}) {
  return (
    <div
      className={`p-2 rounded border ${isActive ? 'bg-primary/10 border-primary' : 'bg-muted'}`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <Badge variant={isActive ? 'default' : 'secondary'}>{position}</Badge>
          <span
            className={`w-2 h-2 rounded-full ${getSideColor(entry.character.side)}`}
          />
          <span className='font-medium'>{entry.character.characterName}</span>
        </div>
        <Badge variant='outline'>{entry.initiativeTotal}</Badge>
      </div>
    </div>
  );
}

// Componente para mostrar estado de personaje activo
function CharacterStatusCard({ character }: { character: CombatCharacter }) {
  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        <span
          className={`w-3 h-3 rounded-full ${getSideColor(character.side)}`}
        />
        <span className='font-semibold'>{character.characterName}</span>
      </div>

      <div className='grid grid-cols-2 gap-2 text-sm'>
        <div className='flex items-center gap-1'>
          <Heart className='h-4 w-4 text-red-500' />
          <span>
            {character.currentPhysicalHealth}/
            {character.combatStats?.maxPhysicalHealth}
          </span>
        </div>
        <div className='flex items-center gap-1'>
          <Brain className='h-4 w-4 text-blue-500' />
          <span>
            {character.currentMentalHealth}/
            {character.combatStats?.maxMentalHealth}
          </span>
        </div>
        <div className='flex items-center gap-1'>
          <Sword className='h-4 w-4' />
          <span>ATQ {character.combatStats?.attack}</span>
        </div>
        <div className='flex items-center gap-1'>
          <Shield className='h-4 w-4' />
          <span>DEF {character.combatStats?.defense}</span>
        </div>
      </div>

      {/* Efectos activos */}
      {character.combatEffects.length > 0 && (
        <div className='space-y-1'>
          <span className='text-xs font-medium'>Efectos:</span>
          <div className='flex flex-wrap gap-1'>
            {character.combatEffects.map((effect) => (
              <Badge key={effect.id} variant='secondary' className='text-xs'>
                {effect.name} ({effect.durationValue})
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Componente para mostrar estado resumido de participante
function ParticipantStatusCard({ character }: { character: CombatCharacter }) {
  const isAlive = character.currentPhysicalHealth > 0;

  return (
    <div
      className={`p-2 rounded border ${isAlive ? '' : 'opacity-50 bg-muted'}`}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-2'>
          <span
            className={`w-2 h-2 rounded-full ${getSideColor(character.side)}`}
          />
          <span className='text-sm font-medium'>{character.characterName}</span>
        </div>
        <div className='flex items-center gap-2 text-xs'>
          <span className='flex items-center gap-1'>
            <Heart className='h-3 w-3 text-red-500' />
            {character.currentPhysicalHealth}
          </span>
          <span className='flex items-center gap-1'>
            <Brain className='h-3 w-3 text-blue-500' />
            {character.currentMentalHealth}
          </span>
        </div>
      </div>
    </div>
  );
}

// Funciones auxiliares
function getActionLabel(actionType: CombatActionType): string {
  const labels: Record<CombatActionType, string> = {
    [CombatActionType.ATACAR]: 'Atacar',
    [CombatActionType.ACCION_NORMAL]: 'Acción Normal',
    [CombatActionType.ACCION_PREPARADA]: 'Acción Preparada',
    [CombatActionType.ATAQUE_NO_LETAL]: 'Ataque No Letal',
    [CombatActionType.ATAQUE_APUNTADO]: 'Ataque Apuntado',
    [CombatActionType.ATAQUE_COMBINADO]: 'Ataque Combinado',
    [CombatActionType.ATAQUE_SIMULTANEO]: 'Ataque Simultáneo',
    [CombatActionType.ATAQUE_TOTAL]: 'Ataque Total',
    [CombatActionType.DEFENSA_TOTAL]: 'Defensa Total',
    [CombatActionType.PROTEGER_ALIADO]: 'Proteger Aliado',
    [CombatActionType.NO_ACTUAR]: 'No Actuar',
    [CombatActionType.GUARDAR_ACCION]: 'Guardar Acción',
    [CombatActionType.MEDICO_COMBATE]: 'Médico de Combate',
    [CombatActionType.EFECTO_EPICO]: 'Efecto Épico',
    [CombatActionType.APREHENDER]: 'Aprehender',
  };

  return labels[actionType] || actionType;
}

function needsTarget(actionType: CombatActionType): boolean {
  return [
    CombatActionType.ATACAR,
    CombatActionType.PROTEGER_ALIADO,
    CombatActionType.MEDICO_COMBATE,
    CombatActionType.APREHENDER,
  ].includes(actionType);
}

function getSideColor(side: CombatSide): string {
  switch (side) {
    case CombatSide.ALIADO:
      return 'bg-green-500';
    case CombatSide.ENEMIGO:
      return 'bg-red-500';
    case CombatSide.NEUTRO:
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
}
