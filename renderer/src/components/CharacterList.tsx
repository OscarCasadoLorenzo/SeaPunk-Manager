import { Badge } from '@/ui/primitives/badge';
import { Button } from '@/ui/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/primitives/card';
import {
  Clock,
  Edit,
  Eye,
  EyeOff,
  Heart,
  Shield,
  Sword,
  Target,
  Zap,
} from 'lucide-react';
import { Character } from './types';

interface CharacterListProps {
  characters: Character[];
  onEditCharacter: (character: Character) => void;
  onToggleVisibility: (id: string) => void;
}

export function CharacterList({
  characters,
  onEditCharacter,
  onToggleVisibility,
}: CharacterListProps) {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
      {characters.map((character) => (
        <Card key={character.id} className='clean-card'>
          <CardHeader className='pb-3'>
            <div className='flex items-center justify-between'>
              <CardTitle className='text-lg flex items-center gap-2'>
                {character.characterName || character.playerName}
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
              </CardTitle>
              <div className='flex items-center gap-2'>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => onEditCharacter(character)}
                >
                  <Edit className='w-4 h-4' />
                </Button>
                <Button
                  size='sm'
                  variant='ghost'
                  onClick={() => onToggleVisibility(character.id)}
                  className={
                    character.visible ? 'text-green-400' : 'text-gray-400'
                  }
                >
                  {character.visible ? (
                    <Eye className='w-4 h-4' />
                  ) : (
                    <EyeOff className='w-4 h-4' />
                  )}
                </Button>
              </div>
            </div>
            {character.playerName && character.characterName && (
              <p className='text-sm text-muted-foreground'>
                Jugador: {character.playerName} | {character.archetype}
              </p>
            )}
          </CardHeader>
          <CardContent className='space-y-3'>
            <div className='grid grid-cols-2 gap-4'>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Heart className='w-4 h-4 text-red-400' />
                  <span className='text-sm'>
                    Salud Física: {character.combat.saludFisica}/
                    {character.combat.maxSaludFisica}
                  </span>
                </div>
                <div className='w-full bg-gray-700 rounded-full h-2'>
                  <div
                    className='bg-red-500 h-2 rounded-full transition-all duration-300'
                    style={{
                      width: `${
                        character.combat.maxSaludFisica > 0
                          ? (character.combat.saludFisica /
                              character.combat.maxSaludFisica) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className='space-y-2'>
                <div className='flex items-center gap-2'>
                  <Zap className='w-4 h-4 text-purple-400' />
                  <span className='text-sm'>
                    Salud Mental: {character.combat.saludMental}/
                    {character.combat.maxSaludMental}
                  </span>
                </div>
                <div className='w-full bg-gray-700 rounded-full h-2'>
                  <div
                    className='bg-purple-500 h-2 rounded-full transition-all duration-300'
                    style={{
                      width: `${
                        character.combat.maxSaludMental > 0
                          ? (character.combat.saludMental /
                              character.combat.maxSaludMental) *
                            100
                          : 0
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            <div className='grid grid-cols-3 gap-2 text-sm'>
              <div className='text-center p-2 bg-slate-700 rounded'>
                <Target className='w-4 h-4 mx-auto mb-1 text-yellow-400' />
                <div>Iniciativa</div>
                <div className='font-bold'>{character.initiative}</div>
              </div>
              <div className='text-center p-2 bg-slate-700 rounded'>
                <Sword className='w-4 h-4 mx-auto mb-1 text-red-400' />
                <div>Ataque</div>
                <div className='font-bold'>{character.attack}</div>
              </div>
              <div className='text-center p-2 bg-slate-700 rounded'>
                <Shield className='w-4 h-4 mx-auto mb-1 text-blue-400' />
                <div>Defensa</div>
                <div className='font-bold'>{character.defense}</div>
              </div>
            </div>

            {character.effects.length > 0 && (
              <div className='space-y-2'>
                <div className='text-sm font-semibold flex items-center gap-2'>
                  <Zap className='w-4 h-4' />
                  Efectos Activos
                </div>
                {character.effects.map((effect) => (
                  <div
                    key={effect.id}
                    className='flex items-center justify-between p-2 bg-slate-700 rounded'
                  >
                    <div>
                      <div className='font-medium'>{effect.name}</div>
                      <div className='text-xs text-gray-400'>
                        {effect.description}
                      </div>
                    </div>
                    <div className='flex items-center gap-2'>
                      <Badge
                        variant={
                          effect.type === 'buff'
                            ? 'default'
                            : effect.type === 'debuff'
                              ? 'destructive'
                              : 'secondary'
                        }
                      >
                        <Clock className='w-3 h-3 mr-1' />
                        {effect.duration}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
