import { useCharacterContext } from '@/contexts/CharacterContext';
import {
  useAttribute,
  useAuraGiftsByCharacter,
  useCharacterWithDetails,
  useCombatStats,
  useDomain,
  useEffects,
  useInventories,
  useNarrative,
  useUpdateAttribute,
  useUpdateCharacter,
  useUpdateCombatStats,
  useUpdateDomain,
  useUpdateNarrative,
} from '@/hooks';
import { Card, CardContent } from '@/ui/primitives/card';
import { Label } from '@/ui/primitives/label';
import { Skeleton } from '@/ui/primitives/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/primitives/tabs';
import { Textarea } from '@/ui/primitives/textarea';
import { FormBuilder, extractDefaultValues } from '@/utils/form-builder';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  characterFormConfig,
  characterFormSchema,
  type CharacterFormData,
} from './characterFormConfig';

export default function CharacterInfoPage() {
  const { selectedCharacterId } = useCharacterContext();
  const [isEditing, setIsEditing] = useState(false);

  const { data: character, isLoading: characterLoading } =
    useCharacterWithDetails(selectedCharacterId || '');
  const { data: attributes } = useAttribute(selectedCharacterId || '');
  const { data: domains } = useDomain(selectedCharacterId || '');
  const { data: combatStats } = useCombatStats(selectedCharacterId || '');
  const { data: narrative } = useNarrative(selectedCharacterId || '');
  const { data: inventories } = useInventories(selectedCharacterId || '');
  const { data: effects } = useEffects(selectedCharacterId || '');
  const { data: auraGifts } = useAuraGiftsByCharacter(
    selectedCharacterId || ''
  );

  // Mutation hooks
  const updateCharacter = useUpdateCharacter();
  const updateAttribute = useUpdateAttribute();
  const updateDomain = useUpdateDomain();
  const updateCombatStats = useUpdateCombatStats();
  const updateNarrative = useUpdateNarrative();

  // Extract current values for default form values
  const getDefaultValues = (): CharacterFormData => {
    if (!character || !attributes || !domains || !combatStats || !narrative) {
      return extractDefaultValues(characterFormConfig) as CharacterFormData;
    }

    return {
      // Basic character info
      playerName: character.player?.playerName || '',
      characterName: character.characterName,
      archetype: character.archetype,
      faction: character.faction,
      race: character.race,
      category: character.category,
      level: character.level,
      epicPoints: character.epicPoints,
      physicalDescription: narrative.physicalDescription || '',

      // Attributes
      strength: attributes.strength,
      agility: attributes.agility,
      willpower: attributes.willpower,
      luck: attributes.luck,
      intelligence: attributes.intelligence,

      // Domains
      physical: domains.physical,
      combat: domains.combat,
      social: domains.social,
      environmental: domains.environmental,
      stealth: domains.stealth,
      knowledge: domains.knowledge,
      technical: domains.technical,
      resources: domains.resources,
      demonic: domains.demonic,
      aura: domains.aura,

      // Combat Stats
      physicalHealth: combatStats.physicalHealth,
      maxPhysicalHealth: combatStats.maxPhysicalHealth,
      physicalResistance: combatStats.physicalResistance,
      maxPhysicalResistance: combatStats.maxPhysicalResistance,
      mentalHealth: combatStats.mentalHealth,
      maxMentalHealth: combatStats.maxMentalHealth,
      mentalResistance: combatStats.mentalResistance,
      maxMentalResistance: combatStats.maxMentalResistance,
      initiative: combatStats.initiative,
      defense: combatStats.defense,
      attack: combatStats.attack,
      impact: combatStats.impact,
      maxDamage: combatStats.maxDamage,

      // Narrative fields
      externalProfile: narrative.externalProfile || '',
      internalProfile: narrative.internalProfile || '',
      background: narrative.background || '',
      specialties: narrative.specialties || '',
    };
  };

  const form = useForm<CharacterFormData>({
    resolver: zodResolver(characterFormSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange',
  });

  // Update form when data changes
  React.useEffect(() => {
    if (character && attributes && domains && combatStats && narrative) {
      form.reset(getDefaultValues());
    }
  }, [character, attributes, domains, combatStats, narrative, form]);

  const handleSubmit = async (data: CharacterFormData) => {
    if (!selectedCharacterId) return;

    try {
      // Update character basic info
      await updateCharacter.mutateAsync({
        id: selectedCharacterId,
        data: {
          characterName: data.characterName,
          archetype: data.archetype,
          faction: data.faction,
          race: data.race,
          category: data.category,
          level: data.level,
          epicPoints: data.epicPoints,
        },
      });

      // Update attributes
      if (attributes?.id) {
        await updateAttribute.mutateAsync({
          id: attributes.id,
          data: {
            strength: data.strength,
            agility: data.agility,
            willpower: data.willpower,
            luck: data.luck,
            intelligence: data.intelligence,
          },
        });
      }

      // Update domains
      if (domains?.id) {
        await updateDomain.mutateAsync({
          id: domains.id,
          data: {
            physical: data.physical,
            combat: data.combat,
            social: data.social,
            environmental: data.environmental,
            stealth: data.stealth,
            knowledge: data.knowledge,
            technical: data.technical,
            resources: data.resources,
            demonic: data.demonic,
            aura: data.aura,
          },
        });
      }

      // Update combat stats
      if (combatStats?.id) {
        await updateCombatStats.mutateAsync({
          id: combatStats.id,
          data: {
            physicalHealth: data.physicalHealth,
            maxPhysicalHealth: data.maxPhysicalHealth,
            physicalResistance: data.physicalResistance,
            maxPhysicalResistance: data.maxPhysicalResistance,
            mentalHealth: data.mentalHealth,
            maxMentalHealth: data.maxMentalHealth,
            mentalResistance: data.mentalResistance,
            maxMentalResistance: data.maxMentalResistance,
            initiative: data.initiative,
            defense: data.defense,
            attack: data.attack,
            impact: data.impact,
            maxDamage: data.maxDamage,
          },
        });
      }

      // Update narrative
      if (narrative?.id) {
        await updateNarrative.mutateAsync({
          id: narrative.id,
          data: {
            physicalDescription: data.physicalDescription,
            externalProfile: data.externalProfile,
            internalProfile: data.internalProfile,
            background: data.background,
            specialties: data.specialties,
          },
        });
      }

      toast.success('Character updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update character');
      console.error('Error updating character:', error);
    }
  };

  if (!selectedCharacterId) {
    return (
      <div className='flex flex-col items-center justify-center p-4 w-full max-w-4xl mx-auto h-full'>
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
      <div className='flex flex-col items-center justify-center p-4 w-full max-w-4xl mx-auto'>
        <Card className='w-full'>
          <CardContent>
            <Skeleton className='h-96 w-full' />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!character) {
    return (
      <div className='flex flex-col items-center justify-center p-4 w-full max-w-4xl mx-auto h-full'>
        <Card className='w-full'>
          <CardContent className='flex items-center justify-center h-64'>
            <p className='text-red-500'>Error al cargar el personaje</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className='flex flex-col p-4 w-full max-w-4xl mx-auto'>
        <FormBuilder
          config={{
            ...characterFormConfig,
            cancelButton: {
              text: 'Cancelar',
              onClick: () => {
                form.reset();
                setIsEditing(false);
              },
            },
          }}
          form={form}
          onSubmit={handleSubmit}
          isLoading={
            updateCharacter.isPending ||
            updateAttribute.isPending ||
            updateDomain.isPending ||
            updateCombatStats.isPending ||
            updateNarrative.isPending
          }
        />
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center p-4 w-full max-w-4xl mx-auto'>
      <Card className='w-full'>
        <CardContent className='p-6'>
          <div className='flex justify-between items-center mb-6'>
            <h2 className='text-2xl font-bold'>
              Ficha de Personaje - {character.characterName}
            </h2>
            <button
              onClick={() => setIsEditing(true)}
              className='px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
            >
              Editar ficha
            </button>
          </div>

          <Tabs defaultValue='narrativos' className='w-full'>
            <TabsList className='mb-4'>
              <TabsTrigger value='narrativos'>Narrativos</TabsTrigger>
              <TabsTrigger value='efectos'>Efectos e Inventario</TabsTrigger>
            </TabsList>

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
              </div>
            </TabsContent>

            <TabsContent value='efectos'>
              <div className='grid gap-4'>
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
        </CardContent>
      </Card>
    </div>
  );
}
