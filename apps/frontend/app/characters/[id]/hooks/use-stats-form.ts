import { useCharacterContext } from "@/contexts/CharacterContext";
import { useUpdateAttribute } from "@/hooks/useAttributes";
import { useUpdateCharacter } from "@/hooks/useCharacters";
import { useUpdateCombatStats } from "@/hooks/useCombatStats";
import { useUpdateDomain } from "@/hooks/useDomains";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  statsFormSchema,
  type StatsFormData,
} from "../schemas/stats-form-schema";

export const useStatsForm = (character: any) => {
  const { selectedCharacterId } = useCharacterContext();

  // Extract data from the passed character object
  const attributes = character?.attributes;
  const domains = character?.domains;
  const combatStats = character?.combatStats;
  const characterLoading = false;

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
        userId: "",
        characterName: "",
        archetype: "",
        faction: "",
        race: "",
        category: "",
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

    const attrs = attributes;
    const doms = domains;
    const combatSt = combatStats;

    return {
      // Basic character info
      userId: character.userId || "",
      characterName: character.characterName || "",
      archetype: character.archetype || "",
      faction: character.faction || "",
      race: character.race || "",
      category: character.category || "",
      level: character.level || 1,
      epicPoints: character.epicPoints || 0,

      // Attributes
      strength: attrs.strength,
      agility: attrs.agility,
      willpower: attrs.willpower,
      luck: attrs.luck,
      intelligence: attrs.intelligence,

      // Domains
      physical: doms.physical,
      combat: doms.combat,
      social: doms.social,
      environmental: doms.environmental,
      stealth: doms.stealth,
      knowledge: doms.knowledge,
      technical: doms.technical,
      resources: doms.resources,
      demonic: doms.demonic,
      aura: doms.aura,

      // Combat Stats
      physicalHealth: combatSt.physicalHealth,
      maxPhysicalHealth: combatSt.maxPhysicalHealth,
      physicalResistance: combatSt.physicalResistance,
      maxPhysicalResistance: combatSt.maxPhysicalResistance,
      mentalHealth: combatSt.mentalHealth,
      maxMentalHealth: combatSt.maxMentalHealth,
      mentalResistance: combatSt.mentalResistance,
      maxMentalResistance: combatSt.maxMentalResistance,
      initiative: combatSt.initiative,
      defense: combatSt.defense,
      attack: combatSt.attack,
      impact: combatSt.impact,
      maxDamage: combatSt.maxDamage,
    };
  };

  // Form setup
  const form = useForm<StatsFormData>({
    resolver: zodResolver(statsFormSchema),
    defaultValues: getDefaultValues(),
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  // Reset form when character changes (immediate reset to prevent showing old data)
  React.useEffect(() => {
    if (selectedCharacterId) {
      // Immediately reset to default empty values when character changes
      form.reset({
        playerName: "",
        characterName: "",
        archetype: "",
        faction: "",
        race: "",
        category: "",
        level: 1,
        epicPoints: 0,
        strength: 1,
        agility: 1,
        willpower: 1,
        luck: 1,
        intelligence: 1,
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
      });
    }
  }, [selectedCharacterId]);

  // Update form with actual data when it loads
  React.useEffect(() => {
    if (
      character &&
      attributes &&
      domains &&
      combatStats &&
      selectedCharacterId
    ) {
      const defaultValues = getDefaultValues();
      form.reset(defaultValues);
    }
  }, [character, attributes, domains, combatStats]);

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
      if (attributes && (attributes as any).id) {
        await updateAttribute.mutateAsync({
          id: (attributes as any).id,
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
      if (domains && (domains as any).id) {
        await updateDomain.mutateAsync({
          id: (domains as any).id,
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
      if (combatStats && (combatStats as any).id) {
        await updateCombatStats.mutateAsync({
          id: (combatStats as any).id,
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

      toast.success("Estadísticas actualizadas correctamente");
    } catch (error) {
      toast.error("Error al actualizar las estadísticas");
      console.error("Error updating stats:", error);
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
