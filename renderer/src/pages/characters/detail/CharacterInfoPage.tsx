import { useCharacterContext } from '@/contexts/CharacterContext';
import {
  useAttribute,
  useAuraGiftsByCharacter,
  useCharacterWithDetails,
  useCombatStats,
  useDomain,
  useEffects,
  useEssencesByCharacter,
  useInventories,
  useNarrative,
} from '@/hooks';
import { Button } from '@/ui/primitives/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/primitives/card';
import { Input } from '@/ui/primitives/input';
import { Label } from '@/ui/primitives/label';
import { Skeleton } from '@/ui/primitives/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/primitives/tabs';
import { Textarea } from '@/ui/primitives/textarea';

export default function CharacterInfoPage() {
  const { selectedCharacterId } = useCharacterContext();

  const { data: character, isLoading: characterLoading } =
    useCharacterWithDetails(selectedCharacterId || '');
  const { data: attributes } = useAttribute(selectedCharacterId || '');
  const { data: domains } = useDomain(selectedCharacterId || '');
  const { data: combatStats } = useCombatStats(selectedCharacterId || '');
  const { data: narrative } = useNarrative(selectedCharacterId || '');
  const { data: inventories } = useInventories(selectedCharacterId || '');
  const { data: effects } = useEffects(selectedCharacterId || '');
  const { data: essences } = useEssencesByCharacter(selectedCharacterId || '');
  const { data: auraGifts } = useAuraGiftsByCharacter(
    selectedCharacterId || ''
  );

  if (!selectedCharacterId) {
    return (
      <div className='flex flex-col items-center justify-center p-4 w-full max-w-3xl mx-auto h-full'>
        <Card className='w-full'>
          <CardContent className='flex items-center justify-center h-64'>
            <p className='text-muted-foreground'>
              Selecciona un personaje para ver sus detalles
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (characterLoading) {
    return (
      <div className='flex flex-col items-center justify-center p-4 w-full max-w-3xl mx-auto'>
        <Card className='w-full'>
          <CardHeader>
            <Skeleton className='h-6 w-48' />
          </CardHeader>
          <CardContent>
            <Skeleton className='h-96 w-full' />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!character) {
    return (
      <div className='flex flex-col items-center justify-center p-4 w-full max-w-3xl mx-auto h-full'>
        <Card className='w-full'>
          <CardContent className='flex items-center justify-center h-64'>
            <p className='text-red-500'>Error al cargar el personaje</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center p-4 w-full max-w-3xl mx-auto'>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Ficha de Personaje - {character.characterName}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue='numerales' className='w-full'>
            <TabsList className='mb-4'>
              <TabsTrigger value='numerales'>Numerales</TabsTrigger>
              <TabsTrigger value='narrativos'>Narrativos</TabsTrigger>
            </TabsList>
            <TabsContent value='numerales'>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <Label>Nombre del jugador</Label>
                  <Input value={character.player?.playerName || ''} readOnly />
                </div>
                <div>
                  <Label>Nombre del personaje</Label>
                  <Input value={character.characterName} readOnly />
                </div>
                <div>
                  <Label>Arquetipo</Label>
                  <Input value={character.archetype} readOnly />
                </div>
                <div>
                  <Label>Facción</Label>
                  <Input value={character.faction} readOnly />
                </div>
                <div>
                  <Label>Raza</Label>
                  <Input value={character.race} readOnly />
                </div>
                <div>
                  <Label>Categoría</Label>
                  <Input value={character.category} readOnly />
                </div>
                <div>
                  <Label>Nivel</Label>
                  <Input type='number' value={character.level} readOnly />
                </div>
                <div>
                  <Label>Puntos de Épica (PÉP)</Label>
                  <Input type='number' value={character.epicPoints} readOnly />
                </div>
                <div>
                  <Label>Esencias</Label>
                  <Input
                    value={
                      essences?.map((e) => e.essence?.name).join(', ') || ''
                    }
                    readOnly
                  />
                </div>
                <div>
                  <Label>Descripción física</Label>
                  <Input
                    value={narrative?.physicalDescription || ''}
                    readOnly
                  />
                </div>
              </div>
              {/* Attributes */}
              <div className='mt-6'>
                <Label className='mb-2 block'>Atributos</Label>
                <div className='grid grid-cols-3 gap-4'>
                  <div>
                    <Label>Fuerza (FUE)</Label>
                    <Input
                      type='number'
                      value={attributes?.strength ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Agilidad (DIN)</Label>
                    <Input
                      type='number'
                      value={attributes?.agility ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Voluntad (VOL)</Label>
                    <Input
                      type='number'
                      value={attributes?.willpower ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Suerte (SUR)</Label>
                    <Input
                      type='number'
                      value={attributes?.luck ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Inteligencia (INT)</Label>
                    <Input
                      type='number'
                      value={attributes?.intelligence ?? ''}
                      readOnly
                    />
                  </div>
                </div>
              </div>
              {/* Domains */}
              <div className='mt-6'>
                <Label className='mb-2 block'>Dominios</Label>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Físico</Label>
                    <Input
                      type='number'
                      value={domains?.physical ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Batalla</Label>
                    <Input
                      type='number'
                      value={domains?.combat ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Social</Label>
                    <Input
                      type='number'
                      value={domains?.social ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Ambiental</Label>
                    <Input
                      type='number'
                      value={domains?.environmental ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Sigilo</Label>
                    <Input
                      type='number'
                      value={domains?.stealth ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Conocimiento</Label>
                    <Input
                      type='number'
                      value={domains?.knowledge ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Técnico</Label>
                    <Input
                      type='number'
                      value={domains?.technical ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Recursos</Label>
                    <Input
                      type='number'
                      value={domains?.resources ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Demoníaco</Label>
                    <Input
                      type='number'
                      value={domains?.demonic ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Aura</Label>
                    <Input type='number' value={domains?.aura ?? ''} readOnly />
                  </div>
                </div>
              </div>
              {/* Combat Stats */}
              <div className='mt-6'>
                <Label className='mb-2 block'>Parámetros de combate</Label>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label>Salud física</Label>
                    <Input
                      type='text'
                      value={
                        combatStats
                          ? `${combatStats.physicalHealth}/${combatStats.maxPhysicalHealth}`
                          : ''
                      }
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Resistencia física</Label>
                    <Input
                      type='text'
                      value={
                        combatStats
                          ? `${combatStats.physicalResistance}/${combatStats.maxPhysicalResistance}`
                          : ''
                      }
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Salud mental</Label>
                    <Input
                      type='text'
                      value={
                        combatStats
                          ? `${combatStats.mentalHealth}/${combatStats.maxMentalHealth}`
                          : ''
                      }
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Resistencia mental</Label>
                    <Input
                      type='text'
                      value={
                        combatStats
                          ? `${combatStats.mentalResistance}/${combatStats.maxMentalResistance}`
                          : ''
                      }
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Iniciativa</Label>
                    <Input
                      type='number'
                      value={combatStats?.initiative ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Defensa</Label>
                    <Input
                      type='number'
                      value={combatStats?.defense ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Ataque</Label>
                    <Input
                      type='number'
                      value={combatStats?.attack ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Impacto</Label>
                    <Input
                      type='number'
                      value={combatStats?.impact ?? ''}
                      readOnly
                    />
                  </div>
                  <div>
                    <Label>Daño máximo</Label>
                    <Input
                      type='number'
                      value={combatStats?.maxDamage ?? ''}
                      readOnly
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value='narrativos'>
              <div className='grid gap-4'>
                <div>
                  <Label>Perfil externo</Label>
                  <Textarea
                    className='min-h-[60px]'
                    value={narrative?.externalProfile || ''}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Perfil interno</Label>
                  <Textarea
                    className='min-h-[60px]'
                    value={narrative?.internalProfile || ''}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Trasfondo</Label>
                  <Textarea
                    className='min-h-[60px]'
                    value={narrative?.background || ''}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Especialidades y poderes</Label>
                  <Textarea
                    className='min-h-[60px]'
                    value={narrative?.specialties || ''}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Efectos Especiales y Dones del Aura</Label>
                  <Textarea
                    className='min-h-[60px]'
                    value={[
                      ...(effects?.map(
                        (e) =>
                          `${e.name} (${e.duration} turnos): ${e.description || ''}`
                      ) || []),
                      ...(auraGifts?.map((ag) => ag.auraGift?.name) || []),
                    ].join('\n')}
                    readOnly
                  />
                </div>
                <div>
                  <Label>Inventario</Label>
                  <Textarea
                    className='min-h-[60px]'
                    value={
                      inventories
                        ?.map(
                          (i) =>
                            `${i.name} (${i.quantity}): ${i.description || ''}`
                        )
                        .join('\n') || ''
                    }
                    readOnly
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
          <div className='mt-6 flex justify-end'>
            <Button>Editar ficha</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
