// Panel de control del DJ para gestión avanzada del combate
import {
  CombatCharacter,
  CombatEffect,
  CombatSide,
  DJControls,
  DurationType,
} from '@/types/combat';
import { Badge } from '@/ui/primitives/badge';
import { Button } from '@/ui/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/primitives/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/primitives/dialog';
import { Input } from '@/ui/primitives/input';
import { Label } from '@/ui/primitives/label';
import { ScrollArea } from '@/ui/primitives/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/primitives/select';
import { Separator } from '@/ui/primitives/separator';
import { Textarea } from '@/ui/primitives/textarea';
import {
  AlertTriangle,
  Brain,
  Crown,
  Heart,
  Image,
  Plus,
  Settings,
  Trash2,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

interface DJPanelProps {
  characters: CombatCharacter[];
  djControls: DJControls;
  onRefresh: () => void;
}

export function DJPanel({ characters, djControls, onRefresh }: DJPanelProps) {
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );
  const [newEffectDialog, setNewEffectDialog] = useState(false);
  const [modifyHealthDialog, setModifyHealthDialog] = useState(false);
  const [imageShareDialog, setImageShareDialog] = useState(false);

  const selectedChar = characters.find((c) => c.id === selectedCharacter);

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2'>
          <Crown className='h-5 w-5 text-yellow-500' />
          Panel de Control del DJ
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        {/* Selección de personaje */}
        <div className='space-y-2'>
          <Label>Personaje a gestionar:</Label>
          <Select
            value={selectedCharacter || ''}
            onValueChange={setSelectedCharacter}
          >
            <SelectTrigger>
              <SelectValue placeholder='Seleccionar personaje...' />
            </SelectTrigger>
            <SelectContent>
              {characters.map((char) => (
                <SelectItem key={char.id} value={char.id}>
                  <div className='flex items-center gap-2'>
                    <span
                      className={`w-2 h-2 rounded-full ${getSideColor(char.side)}`}
                    />
                    {char.characterName}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedChar && (
          <>
            <Separator />

            {/* Estado del personaje seleccionado */}
            <CharacterDJView character={selectedChar} />

            <Separator />

            {/* Controles del DJ */}
            <div className='grid grid-cols-2 gap-2'>
              <Dialog open={newEffectDialog} onOpenChange={setNewEffectDialog}>
                <DialogTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-2'
                  >
                    <Plus className='h-4 w-4' />
                    Añadir Efecto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Añadir Efecto a {selectedChar.characterName}
                    </DialogTitle>
                  </DialogHeader>
                  <AddEffectForm
                    characterId={selectedChar.id}
                    djControls={djControls}
                    onSuccess={() => {
                      setNewEffectDialog(false);
                      onRefresh();
                    }}
                  />
                </DialogContent>
              </Dialog>

              <Dialog
                open={modifyHealthDialog}
                onOpenChange={setModifyHealthDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-2'
                  >
                    <Heart className='h-4 w-4' />
                    Modificar Salud
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>
                      Modificar Salud de {selectedChar.characterName}
                    </DialogTitle>
                  </DialogHeader>
                  <ModifyHealthForm
                    character={selectedChar}
                    djControls={djControls}
                    onSuccess={() => {
                      setModifyHealthDialog(false);
                      onRefresh();
                    }}
                  />
                </DialogContent>
              </Dialog>

              <ForceInitiativeControl
                character={selectedChar}
                djControls={djControls}
                onSuccess={onRefresh}
              />

              <Dialog
                open={imageShareDialog}
                onOpenChange={setImageShareDialog}
              >
                <DialogTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    className='flex items-center gap-2'
                  >
                    <Image className='h-4 w-4' />
                    Compartir Imagen
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Compartir Imagen</DialogTitle>
                  </DialogHeader>
                  <ShareImageForm
                    djControls={djControls}
                    onSuccess={() => {
                      setImageShareDialog(false);
                      onRefresh();
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Lista de efectos activos */}
            {selectedChar.combatEffects.length > 0 && (
              <div className='space-y-2'>
                <Label>Efectos Activos:</Label>
                <ScrollArea className='h-32'>
                  <div className='space-y-2'>
                    {selectedChar.combatEffects.map((effect) => (
                      <EffectCard
                        key={effect.id}
                        effect={effect}
                        characterId={selectedChar.id}
                        djControls={djControls}
                        onUpdate={onRefresh}
                      />
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </>
        )}

        <Separator />

        {/* Controles globales */}
        <div className='space-y-2'>
          <Label>Controles Globales:</Label>
          <div className='flex gap-2'>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => djControls.endCombat()}
              className='flex items-center gap-2'
            >
              <AlertTriangle className='h-4 w-4' />
              Terminar Combate
            </Button>

            <Button
              variant='outline'
              size='sm'
              onClick={onRefresh}
              className='flex items-center gap-2'
            >
              <Settings className='h-4 w-4' />
              Actualizar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Componente para vista detallada del personaje
function CharacterDJView({ character }: { character: CombatCharacter }) {
  return (
    <div className='space-y-2'>
      <div className='flex items-center gap-2'>
        <span
          className={`w-3 h-3 rounded-full ${getSideColor(character.side)}`}
        />
        <span className='font-semibold'>{character.characterName}</span>
        <Badge variant='outline'>{character.side}</Badge>
      </div>

      <div className='grid grid-cols-2 gap-4 text-sm'>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <Heart className='h-4 w-4 text-red-500' />
            <span>
              Vida Física: {character.currentPhysicalHealth}/
              {character.combatStats?.maxPhysicalHealth}
            </span>
          </div>
          <div className='flex items-center gap-2'>
            <Brain className='h-4 w-4 text-blue-500' />
            <span>
              Vida Mental: {character.currentMentalHealth}/
              {character.combatStats?.maxMentalHealth}
            </span>
          </div>
        </div>

        <div className='space-y-1'>
          <div>
            ATQ: {character.combatStats?.attack}{' '}
            {getModifierText(character.currentModifiers.attack)}
          </div>
          <div>
            DEF: {character.combatStats?.defense}{' '}
            {getModifierText(character.currentModifiers.defense)}
          </div>
          <div>
            IMP: {character.combatStats?.impact}{' '}
            {getModifierText(character.currentModifiers.impact)}
          </div>
          <div>
            INI: {character.combatStats?.initiative}{' '}
            {getModifierText(character.currentModifiers.initiative)}
          </div>
        </div>
      </div>
    </div>
  );
}

// Formulario para añadir efectos
function AddEffectForm({
  characterId,
  djControls,
  onSuccess,
}: {
  characterId: string;
  djControls: DJControls;
  onSuccess: () => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    durationType: DurationType.ASALTO,
    durationValue: 1,
    modifiers: {
      attack: 0,
      defense: 0,
      impact: 0,
      initiative: 0,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await djControls.addDirectEffect(characterId, {
        name: formData.name,
        description: formData.description,
        modifiers: formData.modifiers,
        durationType: formData.durationType,
        durationValue: formData.durationValue,
        origin: 'DJ',
        persistent: false,
      });

      onSuccess();
    } catch (error) {
      console.error('Error añadiendo efecto:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Nombre del Efecto</Label>
        <Input
          id='name'
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          placeholder='Ej: Bendición, Maldición...'
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='description'>Descripción</Label>
        <Textarea
          id='description'
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder='Descripción del efecto...'
        />
      </div>

      <div className='grid grid-cols-2 gap-2'>
        <div className='space-y-2'>
          <Label htmlFor='durationType'>Tipo de Duración</Label>
          <Select
            value={formData.durationType}
            onValueChange={(value) =>
              setFormData((prev) => ({
                ...prev,
                durationType: value as DurationType,
              }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(DurationType).map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='durationValue'>Duración</Label>
          <Input
            id='durationValue'
            type='number'
            min='1'
            value={formData.durationValue}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                durationValue: parseInt(e.target.value) || 1,
              }))
            }
          />
        </div>
      </div>

      <div className='space-y-2'>
        <Label>Modificadores</Label>
        <div className='grid grid-cols-2 gap-2'>
          {Object.entries(formData.modifiers).map(([key, value]) => (
            <div key={key} className='space-y-1'>
              <Label htmlFor={key} className='text-xs capitalize'>
                {key}
              </Label>
              <Input
                id={key}
                type='number'
                value={value}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    modifiers: {
                      ...prev.modifiers,
                      [key]: parseInt(e.target.value) || 0,
                    },
                  }))
                }
                className='text-xs'
              />
            </div>
          ))}
        </div>
      </div>

      <Button type='submit' className='w-full'>
        Añadir Efecto
      </Button>
    </form>
  );
}

// Formulario para modificar salud
function ModifyHealthForm({
  character,
  djControls,
  onSuccess,
}: {
  character: CombatCharacter;
  djControls: DJControls;
  onSuccess: () => void;
}) {
  const [physicalChange, setPhysicalChange] = useState<number>(0);
  const [mentalChange, setMentalChange] = useState<number>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await djControls.modifyHealth(character.id, physicalChange, mentalChange);
      onSuccess();
    } catch (error) {
      console.error('Error modificando salud:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label>Vida Física Actual: {character.currentPhysicalHealth}</Label>
        <Input
          type='number'
          placeholder='Cambio en vida física (+ para curar, - para dañar)'
          value={physicalChange || ''}
          onChange={(e) => setPhysicalChange(parseInt(e.target.value) || 0)}
        />
      </div>

      <div className='space-y-2'>
        <Label>Vida Mental Actual: {character.currentMentalHealth}</Label>
        <Input
          type='number'
          placeholder='Cambio en vida mental (+ para curar, - para dañar)'
          value={mentalChange || ''}
          onChange={(e) => setMentalChange(parseInt(e.target.value) || 0)}
        />
      </div>

      <Button type='submit' className='w-full'>
        Aplicar Cambios
      </Button>
    </form>
  );
}

// Control para forzar iniciativa
function ForceInitiativeControl({
  character,
  djControls,
  onSuccess,
}: {
  character: CombatCharacter;
  djControls: DJControls;
  onSuccess: () => void;
}) {
  const [newInitiative, setNewInitiative] = useState<number>(10);

  const handleForceInitiative = async () => {
    try {
      await djControls.forceInitiative(character.id, newInitiative);
      onSuccess();
    } catch (error) {
      console.error('Error forzando iniciativa:', error);
    }
  };

  return (
    <div className='flex gap-2'>
      <Input
        type='number'
        placeholder='Nueva iniciativa'
        value={newInitiative}
        onChange={(e) => setNewInitiative(parseInt(e.target.value) || 10)}
        className='flex-1'
      />
      <Button onClick={handleForceInitiative} size='sm'>
        <Zap className='h-4 w-4' />
      </Button>
    </div>
  );
}

// Formulario para compartir imagen
function ShareImageForm({
  djControls,
  onSuccess,
}: {
  djControls: DJControls;
  onSuccess: () => void;
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [label, setLabel] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await djControls.shareImage(imageUrl, label);
      onSuccess();
    } catch (error) {
      console.error('Error compartiendo imagen:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='imageUrl'>URL de la Imagen</Label>
        <Input
          id='imageUrl'
          type='url'
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder='https://...'
          required
        />
      </div>

      <div className='space-y-2'>
        <Label htmlFor='label'>Etiqueta (opcional)</Label>
        <Input
          id='label'
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder='Descripción de la imagen...'
        />
      </div>

      <Button type='submit' className='w-full'>
        Compartir Imagen
      </Button>
    </form>
  );
}

// Tarjeta para mostrar y editar efectos
function EffectCard({
  effect,
  characterId,
  djControls,
  onUpdate,
}: {
  effect: CombatEffect;
  characterId: string;
  djControls: DJControls;
  onUpdate: () => void;
}) {
  const handleRemove = async () => {
    try {
      await djControls.removeEffect(characterId, effect.id);
      onUpdate();
    } catch (error) {
      console.error('Error removiendo efecto:', error);
    }
  };

  return (
    <div className='p-2 border rounded-md space-y-1'>
      <div className='flex items-center justify-between'>
        <span className='font-medium text-sm'>{effect.name}</span>
        <div className='flex items-center gap-1'>
          <Badge variant='secondary' className='text-xs'>
            {effect.durationType} ({effect.durationValue})
          </Badge>
          <Button
            variant='ghost'
            size='sm'
            onClick={handleRemove}
            className='h-6 w-6 p-0'
          >
            <Trash2 className='h-3 w-3' />
          </Button>
        </div>
      </div>

      {effect.description && (
        <p className='text-xs text-muted-foreground'>{effect.description}</p>
      )}

      <div className='flex flex-wrap gap-1'>
        {Object.entries(effect.modifiers).map(
          ([key, value]) =>
            value !== 0 && (
              <Badge key={key} variant='outline' className='text-xs'>
                {key}: {value > 0 ? '+' : ''}
                {value}
              </Badge>
            )
        )}
      </div>
    </div>
  );
}

// Funciones auxiliares
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

function getModifierText(modifier?: number): string {
  if (!modifier || modifier === 0) return '';
  return modifier > 0 ? `(+${modifier})` : `(${modifier})`;
}
