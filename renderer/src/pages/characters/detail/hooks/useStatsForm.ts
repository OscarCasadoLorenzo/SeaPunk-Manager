import { useCharacterContext } from '@/contexts/CharacterContext';
import { useAttribute, useUpdateAttribute } from '@/hooks/useAttributes';
import {
  useCharacterWithDetails,
  useUpdateCharacter,
} from '@/hooks/useCharacters';
import { useCombatStats, useUpdateCombatStats } from '@/hooks/useCombatStats';
import { useDomain, useUpdateDomain } from '@/hooks/useDomains';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
  statsFormSchema,
  type StatsFormData,
} from '../schemas/statsFormSchema';

export const useStatsForm = () => {
  const { selectedCharacterId } = useCharacterContext();

  // Data hooks
  const { data: character, isLoading: characterLoading } =
    useCharacterWithDetails(selectedCharacterId || '');
  const { data: attributes } = useAttribute(selectedCharacterId || '');
  const { data: domains } = useDomain(selectedCharacterId || '');
  const { data: combatStats } = useCombatStats(selectedCharacterId || '');

  // Mutation hooks
  const updateCharacter = useUpdateCharacter();
  const updateAttribute = useUpdateAttribute();
  const updateDomain = useUpdateDomain();
  const updateCombatStats = useUpdateCombatStats();

  // Extract current values for default form values
  const getDefaultValues = (): StatsFormData => {
    if (!character || !attributes || !domains || !combatStats) {
      return {
        // Basic character info defaults
        playerName: '',
        characterName: '',
        archetype: '',
        faction: '',
        race: '',
        category: '',
        level: 1,
        epicPoints: 0,

        // Attributes defaults
        strength: 1,
        agility: 1,
        willpower: 1,
        luck: 1,
        intelligence: 1,

        // Domains defaults
        physical: 0,
        combat: 0,
        social: 0,
        environmental: 0,
        stealth: 0,
        knowledge: 0,
        technical: 0,
        resources: 0,
        demonic: 0,
        aura: 0,

        // Combat Stats defaults
        physicalHealth: 100,
        maxPhysicalHealth: 100,
        physicalResistance: 100,
        maxPhysicalResistance: 100,
        mentalHealth: 100,
        maxMentalHealth: 100,
        mentalResistance: 100,
        maxMentalResistance: 100,
        initiative: 0,
        defense: 0,
        attack: 0,
        impact: 0,
        maxDamage: 0,
      };
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
    };
  };

  // Form setup
  const form = useForm<StatsFormData>({
    resolver: zodResolver(statsFormSchema),
    defaultValues: getDefaultValues(),
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
  });

  // Update form when data changes
  React.useEffect(() => {
    if (character && attributes && domains && combatStats) {
      form.reset(getDefaultValues());
    }
  }, [character, attributes, domains, combatStats, form]);

  // Submit handler
  const handleSubmit = async (data: StatsFormData) => {
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

      toast.success('Estadísticas actualizadas correctamente');
    } catch (error) {
      toast.error('Error al actualizar las estadísticas');
      console.error('Error updating stats:', error);
    }
  };

  // Loading state
  const isLoading =
    updateCharacter.isPending ||
    updateAttribute.isPending ||
    updateDomain.isPending ||
    updateCombatStats.isPending;

  return {
    form,
    handleSubmit,
    isLoading,
    characterLoading,
    character,
    attributes,
    domains,
    combatStats,
  };
};
