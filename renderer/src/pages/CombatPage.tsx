// Página principal del sistema de combate
import { CombatInterface } from '@/components/CombatInterface';
import { DJPanel } from '@/components/DJPanel';
import { useCharacters } from '@/hooks';
import { Character } from '@/types';
import { CombatCharacter, CombatSide } from '@/types/combat';
import { Badge } from '@/ui/primitives/badge';
import { Button } from '@/ui/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/primitives/card';
import { Checkbox } from '@/ui/primitives/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/primitives/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/primitives/select';
import { Separator } from '@/ui/primitives/separator';
import { CombatManager } from '@/utils/CombatManager';
import { useNavigate } from '@tanstack/react-router';
import { Crown, Settings, Swords, Users } from 'lucide-react';
import { useState } from 'react';

export default function CombatPage() {
  const navigate = useNavigate();
  const { data: characters, isLoading } = useCharacters();

  const [combatActive, setCombatActive] = useState(false);
  const [selectedCharacters, setSelectedCharacters] = useState<Set<string>>(
    new Set()
  );
  const [characterSides, setCharacterSides] = useState<
    Record<string, CombatSide>
  >({});
  const [combatCharacters, setCombatCharacters] = useState<CombatCharacter[]>(
    []
  );
  const [combatManager, setCombatManager] = useState<CombatManager | null>(
    null
  );
  const [djMode, setDjMode] = useState(false);
  const [setupDialog, setSetupDialog] = useState(false);

  // Filtrar personajes disponibles para combate
  const availableCharacters =
    characters?.filter(
      (char) =>
        char.combatStats &&
        char.combatStats.physicalHealth > 0 &&
        char.isVisible
    ) || [];

  const handleCharacterToggle = (characterId: string, checked: boolean) => {
    const newSelected = new Set(selectedCharacters);
    if (checked) {
      newSelected.add(characterId);
      // Asignar lado por defecto
      if (!characterSides[characterId]) {
        setCharacterSides((prev) => ({
          ...prev,
          [characterId]: CombatSide.ALIADO,
        }));
      }
    } else {
      newSelected.delete(characterId);
      setCharacterSides((prev) => {
        const updated = { ...prev };
        delete updated[characterId];
        return updated;
      });
    }
    setSelectedCharacters(newSelected);
  };

  const handleSideChange = (characterId: string, side: CombatSide) => {
    setCharacterSides((prev) => ({
      ...prev,
      [characterId]: side,
    }));
  };

  const convertToCombatCharacter = (
    character: Character,
    side: CombatSide
  ): CombatCharacter => {
    return {
      ...character,
      side,
      currentPhysicalHealth: character.combatStats?.physicalHealth || 0,
      currentMentalHealth: character.combatStats?.mentalHealth || 0,
      combatEffects: [],
      currentModifiers: {},
      tiradaCombateActual: undefined,
    };
  };

  const startCombat = () => {
    if (selectedCharacters.size < 2) {
      alert('Necesitas al menos 2 personajes para iniciar combate');
      return;
    }

    const selectedChars = availableCharacters.filter((char) =>
      selectedCharacters.has(char.id)
    );

    const combatChars = selectedChars.map((char) =>
      convertToCombatCharacter(
        char,
        characterSides[char.id] || CombatSide.NEUTRO
      )
    );

    const manager = new CombatManager({
      useSameRollForInitiativeAndAttack: true,
      allowSimultaneousActions: true,
      autoDecayEffects: true,
      djModeEnabled: djMode,
    });

    setCombatCharacters(combatChars);
    setCombatManager(manager);
    setCombatActive(true);
    setSetupDialog(false);
  };

  const endCombat = (winner?: CombatSide) => {
    setCombatActive(false);
    setCombatCharacters([]);
    setCombatManager(null);
    setSelectedCharacters(new Set());
    setCharacterSides({});

    if (winner) {
      console.log(`Combate terminado. Ganador: ${winner}`);
    }
  };

  const refreshCombat = () => {
    if (combatManager) {
      // Forzar re-render actualizando el estado
      setCombatCharacters([...combatManager.getCombatState().participants]);
    }
  };

  if (isLoading) {
    return <div className='p-4'>Cargando personajes...</div>;
  }

  if (combatActive && combatManager) {
    return (
      <div className='p-4 space-y-4'>
        {/* Header del combate */}
        <div className='flex items-center justify-between'>
          <h1 className='text-2xl font-bold flex items-center gap-2'>
            <Swords className='h-6 w-6' />
            Sistema de Combate
          </h1>
          <div className='flex items-center gap-2'>
            {djMode && (
              <Badge variant='secondary' className='flex items-center gap-1'>
                <Crown className='h-3 w-3' />
                Modo DJ
              </Badge>
            )}
            <Button variant='outline' onClick={() => endCombat()}>
              Salir del Combate
            </Button>
          </div>
        </div>

        {/* Interface principal de combate */}
        <div className={djMode ? 'grid grid-cols-1 xl:grid-cols-4 gap-4' : ''}>
          <div className={djMode ? 'xl:col-span-3' : ''}>
            <CombatInterface
              initialCharacters={combatCharacters}
              onCombatEnd={endCombat}
              djMode={djMode}
            />
          </div>

          {djMode && (
            <div className='xl:col-span-1'>
              <DJPanel
                characters={combatCharacters}
                djControls={combatManager.getDJControls()}
                onRefresh={refreshCombat}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className='p-4 space-y-4'>
      {/* Header */}
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold flex items-center gap-2'>
          <Swords className='h-6 w-6' />
          Sistema de Combate
        </h1>
        <Button variant='outline' onClick={() => navigate({ to: '/' })}>
          Volver al Inicio
        </Button>
      </div>

      {/* Estado actual */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Users className='h-5 w-5' />
            Personajes Disponibles para Combate
          </CardTitle>
        </CardHeader>
        <CardContent>
          {availableCharacters.length === 0 ? (
            <div className='text-center text-muted-foreground py-8'>
              No hay personajes disponibles para combate.
              <br />
              Asegúrate de que tengan estadísticas de combate configuradas.
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
              {availableCharacters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  selected={selectedCharacters.has(character.id)}
                  side={characterSides[character.id]}
                  onToggle={(checked) =>
                    handleCharacterToggle(character.id, checked)
                  }
                  onSideChange={(side) => handleSideChange(character.id, side)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Controles de configuración */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <Settings className='h-5 w-5' />
            Configuración del Combate
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='djMode'
              checked={djMode}
              onCheckedChange={(checked) => setDjMode(checked === true)}
            />
            <label htmlFor='djMode' className='flex items-center gap-2'>
              <Crown className='h-4 w-4' />
              Activar Modo DJ (controles avanzados)
            </label>
          </div>

          <div className='flex items-center gap-4'>
            <span className='text-sm text-muted-foreground'>
              Personajes seleccionados: {selectedCharacters.size}
            </span>

            <Dialog open={setupDialog} onOpenChange={setSetupDialog}>
              <DialogTrigger asChild>
                <Button
                  disabled={selectedCharacters.size < 2}
                  className='flex items-center gap-2'
                >
                  <Swords className='h-4 w-4' />
                  Iniciar Combate
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmar Inicio de Combate</DialogTitle>
                </DialogHeader>
                <div className='space-y-4'>
                  <p>
                    ¿Estás seguro de que quieres iniciar el combate con los
                    siguientes personajes?
                  </p>

                  <div className='space-y-2'>
                    {Array.from(selectedCharacters).map((charId) => {
                      const char = availableCharacters.find(
                        (c) => c.id === charId
                      );
                      if (!char) return null;

                      return (
                        <div
                          key={charId}
                          className='flex items-center justify-between p-2 border rounded'
                        >
                          <span>{char.characterName}</span>
                          <Badge
                            variant={
                              characterSides[charId] === CombatSide.ALIADO
                                ? 'default'
                                : characterSides[charId] === CombatSide.ENEMIGO
                                  ? 'destructive'
                                  : 'secondary'
                            }
                          >
                            {characterSides[charId]}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>

                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      onClick={() => setSetupDialog(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={startCombat}>¡Comenzar Combate!</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Componente para mostrar cada personaje disponible
function CharacterCard({
  character,
  selected,
  side,
  onToggle,
  onSideChange,
}: {
  character: Character;
  selected: boolean;
  side?: CombatSide;
  onToggle: (checked: boolean) => void;
  onSideChange: (side: CombatSide) => void;
}) {
  return (
    <Card className={selected ? 'ring-2 ring-primary' : 'p-2'}>
      <CardContent className=''>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Checkbox checked={selected} onCheckedChange={onToggle} />
            <span className='font-medium'>{character.characterName}</span>
          </div>
          {character.isNPC && (
            <Badge variant='outline' className='text-xs'>
              NPC
            </Badge>
          )}
        </div>

        {selected && (
          <>
            <Separator />
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Lado en el combate:</label>
              <Select
                value={side || CombatSide.ALIADO}
                onValueChange={onSideChange}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CombatSide.ALIADO}>
                    <div className='flex items-center gap-2'>
                      <span className='w-2 h-2 rounded-full bg-green-500' />
                      Aliado
                    </div>
                  </SelectItem>
                  <SelectItem value={CombatSide.ENEMIGO}>
                    <div className='flex items-center gap-2'>
                      <span className='w-2 h-2 rounded-full bg-red-500' />
                      Enemigo
                    </div>
                  </SelectItem>
                  <SelectItem value={CombatSide.NEUTRO}>
                    <div className='flex items-center gap-2'>
                      <span className='w-2 h-2 rounded-full bg-yellow-500' />
                      Neutro
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
