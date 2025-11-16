"use client";

import { useCharacterContext } from "@/contexts/CharacterContext";
import { useCreateCharacter, useUpdateCharacter } from "@/hooks/useCharacters";
import {
  createField,
  createFormConfig,
  createSection,
  type FormConfig,
  type FormMode,
  isCreateMode,
  isFieldEditable,
} from "@/utils/form-builder";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// ✅ Schema defined inline
const statsFormSchema = z.object({
  // Basic character info
  userId: z.string().min(1, "Player is required"),
  characterName: z.string().min(1, "Character name is required"),
  archetype: z.string().min(1, "Archetype is required"),
  faction: z.string().min(1, "Faction is required"),
  race: z.string().min(1, "Race is required"),
  category: z.string().optional(),
  level: z.number().min(1, "Level must be at least 1"),
  epicPoints: z.number().min(0, "Epic points cannot be negative"),

  // Attributes
  strength: z.number().min(1, "Strength must be at least 1"),
  agility: z.number().min(1, "Agility must be at least 1"),
  willpower: z.number().min(1, "Willpower must be at least 1"),
  luck: z.number().min(1, "Luck must be at least 1"),
  intelligence: z.number().min(1, "Intelligence must be at least 1"),

  // Domains
  physical: z.number().min(0, "Physical cannot be negative"),
  combat: z.number().min(0, "Combat cannot be negative"),
  social: z.number().min(0, "Social cannot be negative"),
  environmental: z.number().min(0, "Environmental cannot be negative"),
  stealth: z.number().min(0, "Stealth cannot be negative"),
  knowledge: z.number().min(0, "Knowledge cannot be negative"),
  technical: z.number().min(0, "Technical cannot be negative"),
  resources: z.number().min(0, "Resources cannot be negative"),
  demonic: z.number().min(0, "Demonic cannot be negative"),
  aura: z.number().min(0, "Aura cannot be negative"),

  // Combat Stats
  physicalHealth: z.number().min(0, "Physical health cannot be negative"),
  maxPhysicalHealth: z
    .number()
    .min(1, "Max physical health must be at least 1"),
  physicalResistance: z
    .number()
    .min(0, "Physical resistance cannot be negative"),
  maxPhysicalResistance: z
    .number()
    .min(1, "Max physical resistance must be at least 1"),
  mentalHealth: z.number().min(0, "Mental health cannot be negative"),
  maxMentalHealth: z.number().min(1, "Max mental health must be at least 1"),
  mentalResistance: z.number().min(0, "Mental resistance cannot be negative"),
  maxMentalResistance: z
    .number()
    .min(1, "Max mental resistance must be at least 1"),
  initiative: z.number().min(0, "Initiative cannot be negative"),
  defense: z.number().min(0, "Defense cannot be negative"),
  attack: z.number().min(0, "Attack cannot be negative"),
  impact: z.number().min(0, "Impact cannot be negative"),
  maxDamage: z.number().min(0, "Max damage cannot be negative"),
});

type StatsFormData = z.infer<typeof statsFormSchema>;

export const useStatsForm = (
  character: any,
  mode: FormMode = "view",
  users: Array<{ id: string; name: string; email: string }> = [],
) => {
  const { selectedCharacterId } = useCharacterContext();

  // Extract data from character object
  const attributes = character?.attributes;
  const domains = character?.domains;
  const combatStats = character?.combatStats;

  // Mutation hooks
  const createCharacter = useCreateCharacter();
  const updateCharacter = useUpdateCharacter();

  // ✅ Extract default values
  const getDefaultValues = (): StatsFormData => ({
    // Basic character info
    userId: character?.userId || "",
    characterName: character?.characterName || "",
    archetype: character?.archetype || "",
    faction: character?.faction || "",
    race: character?.race || "",
    category: character?.category || "",
    level: character?.level || 1,
    epicPoints: character?.epicPoints || 0,

    // Attributes
    strength: attributes?.strength || 1,
    agility: attributes?.agility || 1,
    willpower: attributes?.willpower || 1,
    luck: attributes?.luck || 1,
    intelligence: attributes?.intelligence || 1,

    // Domains
    physical: domains?.physical || 0,
    combat: domains?.combat || 0,
    social: domains?.social || 0,
    environmental: domains?.environmental || 0,
    stealth: domains?.stealth || 0,
    knowledge: domains?.knowledge || 0,
    technical: domains?.technical || 0,
    resources: domains?.resources || 0,
    demonic: domains?.demonic || 0,
    aura: domains?.aura || 0,

    // Combat Stats
    physicalHealth: combatStats?.physicalHealth || 100,
    maxPhysicalHealth: combatStats?.maxPhysicalHealth || 100,
    physicalResistance: combatStats?.physicalResistance || 100,
    maxPhysicalResistance: combatStats?.maxPhysicalResistance || 100,
    mentalHealth: combatStats?.mentalHealth || 100,
    maxMentalHealth: combatStats?.maxMentalHealth || 100,
    mentalResistance: combatStats?.mentalResistance || 100,
    maxMentalResistance: combatStats?.maxMentalResistance || 100,
    initiative: combatStats?.initiative || 0,
    defense: combatStats?.defense || 0,
    attack: combatStats?.attack || 0,
    impact: combatStats?.impact || 0,
    maxDamage: combatStats?.maxDamage || 0,
  });

  // ✅ Form configuration inline
  const formConfig: FormConfig = React.useMemo(
    () =>
      createFormConfig({
        sections: [
          createSection({
            title: "Información Básica",
            description: "Datos generales del personaje",
            columns: 2,
            fields: [
              createField("select", {
                name: "userId",
                label: "Jugador",
                required: true,
                disabled: !isFieldEditable(mode),
                placeholder: "Selecciona un jugador",
                options: users.map((user) => ({
                  value: user.id,
                  label: `${user.name} (${user.email})`,
                })),
              }),
              createField("text", {
                name: "characterName",
                label: "Nombre del Personaje",
                required: true,
                disabled: !isFieldEditable(mode),
                placeholder: "Nombre del personaje",
              }),
              createField("text", {
                name: "archetype",
                label: "Arquetipo",
                required: true,
                disabled: !isFieldEditable(mode),
                placeholder: "Arquetipo del personaje",
              }),
              createField("text", {
                name: "faction",
                label: "Facción",
                required: true,
                disabled: !isFieldEditable(mode),
                placeholder: "Facción del personaje",
              }),
              createField("text", {
                name: "race",
                label: "Raza",
                required: true,
                disabled: !isFieldEditable(mode),
                placeholder: "Raza del personaje",
              }),
              createField("text", {
                name: "category",
                label: "Categoría",
                disabled: !isFieldEditable(mode),
                placeholder: "Categoría (opcional)",
              }),
              createField("number", {
                name: "level",
                label: "Nivel",
                required: true,
                disabled: !isFieldEditable(mode),
                min: 1,
                defaultValue: 1,
              }),
              createField("number", {
                name: "epicPoints",
                label: "Puntos Épicos",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
            ],
          }),

          createSection({
            title: "Atributos",
            description: "Atributos principales del personaje",
            columns: 3,
            fields: [
              createField("number", {
                name: "strength",
                label: "Fuerza",
                required: true,
                disabled: !isFieldEditable(mode),
                min: 1,
                defaultValue: 1,
              }),
              createField("number", {
                name: "agility",
                label: "Agilidad",
                required: true,
                disabled: !isFieldEditable(mode),
                min: 1,
                defaultValue: 1,
              }),
              createField("number", {
                name: "willpower",
                label: "Voluntad",
                required: true,
                disabled: !isFieldEditable(mode),
                min: 1,
                defaultValue: 1,
              }),
              createField("number", {
                name: "luck",
                label: "Suerte",
                required: true,
                disabled: !isFieldEditable(mode),
                min: 1,
                defaultValue: 1,
              }),
              createField("number", {
                name: "intelligence",
                label: "Inteligencia",
                required: true,
                disabled: !isFieldEditable(mode),
                min: 1,
                defaultValue: 1,
              }),
            ],
          }),

          createSection({
            title: "Dominios",
            description: "Dominios de conocimiento y habilidad",
            columns: 3,
            fields: [
              createField("number", {
                name: "physical",
                label: "Físico",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("number", {
                name: "combat",
                label: "Combate",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("number", {
                name: "social",
                label: "Social",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("number", {
                name: "environmental",
                label: "Ambiental",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("number", {
                name: "stealth",
                label: "Sigilo",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("number", {
                name: "knowledge",
                label: "Conocimiento",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("number", {
                name: "technical",
                label: "Técnico",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("number", {
                name: "resources",
                label: "Recursos",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("number", {
                name: "demonic",
                label: "Demoníaco",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("number", {
                name: "aura",
                label: "Aura",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
            ],
          }),

          createSection({
            title: "Estadísticas de Combate",
            description: "Salud, resistencia y estadísticas de combate",
            columns: 2,
            fields: [
              createField("number", {
                name: "physicalHealth",
                label: "Salud Física",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 100,
              }),
              createField("number", {
                name: "maxPhysicalHealth",
                label: "Salud Física Máxima",
                disabled: !isFieldEditable(mode),
                min: 1,
                defaultValue: 100,
              }),
              createField("number", {
                name: "physicalResistance",
                label: "Resistencia Física",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 100,
              }),
              createField("number", {
                name: "maxPhysicalResistance",
                label: "Resistencia Física Máxima",
                disabled: !isFieldEditable(mode),
                min: 1,
                defaultValue: 100,
              }),
              createField("number", {
                name: "mentalHealth",
                label: "Salud Mental",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 100,
              }),
              createField("number", {
                name: "maxMentalHealth",
                label: "Salud Mental Máxima",
                disabled: !isFieldEditable(mode),
                min: 1,
                defaultValue: 100,
              }),
              createField("number", {
                name: "mentalResistance",
                label: "Resistencia Mental",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 100,
              }),
              createField("number", {
                name: "maxMentalResistance",
                label: "Resistencia Mental Máxima",
                disabled: !isFieldEditable(mode),
                min: 1,
                defaultValue: 100,
              }),
              createField("number", {
                name: "initiative",
                label: "Iniciativa",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("number", {
                name: "defense",
                label: "Defensa",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("number", {
                name: "attack",
                label: "Ataque",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("number", {
                name: "impact",
                label: "Impacto",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("number", {
                name: "maxDamage",
                label: "Daño Máximo",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
            ],
          }),
        ],
      }),
    [mode, users],
  );

  // Form setup
  const form = useForm<StatsFormData>({
    resolver: zodResolver(statsFormSchema),
    defaultValues: getDefaultValues(),
    mode: "onChange",
    reValidateMode: "onChange",
    shouldFocusError: true,
  });

  // Update form when character data changes (only in edit/view mode)
  React.useEffect(() => {
    if (character && selectedCharacterId && !isCreateMode(mode)) {
      form.reset(getDefaultValues());
    }
  }, [character, selectedCharacterId, mode]);

  // ✅ Submit handler
  const handleSubmit = async (data: StatsFormData): Promise<void> => {
    // CREATE MODE
    if (isCreateMode(mode)) {
      try {
        const createPayload: any = {
          characterName: data.characterName,
          archetype: data.archetype,
          faction: data.faction,
          race: data.race,
          category: data.category || "",
          level: data.level,
          epicPoints: data.epicPoints,
          type: "player",
          isNPC: false,
          isVisible: true,
          userId: data.userId,
        };

        // Add nested attributes
        createPayload.attributes = {
          strength: data.strength,
          agility: data.agility,
          willpower: data.willpower,
          luck: data.luck,
          intelligence: data.intelligence,
        };

        // Add nested domains
        createPayload.domains = {
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
        };

        // Add nested combat stats
        createPayload.combatStats = {
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
        };

        await createCharacter.mutateAsync(createPayload);
        toast.success("Personaje creado correctamente");
      } catch (error) {
        toast.error("Error al crear el personaje");
        console.error("Error creating character:", error);
        throw error;
      }
    }

    // UPDATE MODE
    if (!selectedCharacterId) {
      toast.error("No hay personaje seleccionado");
      return;
    }

    try {
      const updatePayload: any = {
        characterName: data.characterName,
        archetype: data.archetype,
        faction: data.faction,
        race: data.race,
        category: data.category,
        level: data.level,
        epicPoints: data.epicPoints,
      };

      // Add attributes if they exist
      if (attributes?.id) {
        updatePayload.attributes = {
          update: {
            strength: data.strength,
            agility: data.agility,
            willpower: data.willpower,
            luck: data.luck,
            intelligence: data.intelligence,
          },
        };
      }

      // Add domains if they exist
      if (domains?.id) {
        updatePayload.domains = {
          update: {
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
        };
      }

      // Add combat stats if they exist
      if (combatStats?.id) {
        updatePayload.combatStats = {
          update: {
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
        };
      }

      await updateCharacter.mutateAsync({
        id: selectedCharacterId,
        data: updatePayload,
      });

      toast.success("Personaje actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el personaje");
      console.error("Error updating character:", error);
    }
  };

  // Loading state
  const isLoading = createCharacter.isPending || updateCharacter.isPending;

  return {
    form,
    formConfig, // ✅ Config exposed from hook
    handleSubmit,
    isLoading,
  };
};
