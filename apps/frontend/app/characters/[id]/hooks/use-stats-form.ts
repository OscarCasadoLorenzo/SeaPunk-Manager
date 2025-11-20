"use client";

import { useCharacterContext } from "@/contexts/CharacterContext";
import { useCreateCharacter, useUpdateCharacter } from "@/hooks/useCharacters";
import type { Character } from "@/types";
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
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface UseStatsFormOptions {
  onCreateSuccess?: (characterId: string) => void;
}

// ✅ Schema defined inline
const statsFormSchema = z.object({
  // Basic character info
  userId: z.string().min(1, "Player is required"),
  characterName: z.string().min(1, "Character name is required"),
  archetype: z.string().min(1, "Archetype is required"),
  faction: z.string().min(1, "Faction is required"),
  race: z.string().min(1, "Race is required"),
  level: z.number().min(1, "Level must be at least 1"),
  epicPoints: z.number().min(0, "Epic points cannot be negative"),

  // Attributes
  strength: z.number().min(1, "Strength must be at least 1"),
  agility: z.number().min(1, "Agility must be at least 1"),
  willpower: z.number().min(1, "Willpower must be at least 1"),
  luck: z.number().min(1, "Luck must be at least 1"),
  intelligence: z.number().min(1, "Intelligence must be at least 1"),

  // Domains
  physicalValue: z.number().min(0, "Physical cannot be negative"),
  physicalEssence: z.string().default(""),
  combatValue: z.number().min(0, "Combat cannot be negative"),
  combatEssence: z.string().default(""),
  socialValue: z.number().min(0, "Social cannot be negative"),
  socialEssence: z.string().default(""),
  environmentalValue: z.number().min(0, "Environmental cannot be negative"),
  environmentalEssence: z.string().default(""),
  stealthValue: z.number().min(0, "Stealth cannot be negative"),
  stealthEssence: z.string().default(""),
  knowledgeValue: z.number().min(0, "Knowledge cannot be negative"),
  knowledgeEssence: z.string().default(""),
  technicalValue: z.number().min(0, "Technical cannot be negative"),
  technicalEssence: z.string().default(""),
  resourcesValue: z.number().min(0, "Resources cannot be negative"),
  resourcesEssence: z.string().default(""),
  demonicValue: z.number().min(0, "Demonic cannot be negative"),
  demonicEssence: z.string().default(""),
  auraValue: z.number().min(0, "Aura cannot be negative"),
  auraEssence: z.string().default(""),

  // Combat Stats - Current values (only for edit/view mode)
  physicalHealth: z
    .number()
    .min(0, "Physical health cannot be negative")
    .optional(),
  physicalResistance: z
    .number()
    .min(0, "Physical resistance cannot be negative")
    .optional(),
  mentalHealth: z
    .number()
    .min(0, "Mental health cannot be negative")
    .optional(),
  mentalResistance: z
    .number()
    .min(0, "Mental resistance cannot be negative")
    .optional(),
  initiative: z.number().min(0, "Initiative cannot be negative").optional(),
  defense: z.number().min(0, "Defense cannot be negative").optional(),
  attack: z.number().min(0, "Attack cannot be negative").optional(),
  impact: z.number().min(0, "Impact cannot be negative").optional(),

  // Combat Stats - Max values (required for create, editable in edit/view mode)
  maxPhysicalHealth: z
    .number()
    .min(1, "Max physical health must be at least 1"),
  maxPhysicalResistance: z
    .number()
    .min(1, "Max physical resistance must be at least 1"),
  maxMentalHealth: z.number().min(1, "Max mental health must be at least 1"),
  maxMentalResistance: z
    .number()
    .min(1, "Max mental resistance must be at least 1"),
  maxInitiative: z
    .number()
    .min(0, "Max initiative cannot be negative")
    .optional(),
  maxDefense: z.number().min(0, "Max defense cannot be negative").optional(),
  maxAttack: z.number().min(0, "Max attack cannot be negative").optional(),
  maxImpact: z.number().min(0, "Max impact cannot be negative").optional(),
  maxDamage: z.number().min(0, "Max damage cannot be negative").optional(),
});

type StatsFormData = z.infer<typeof statsFormSchema>;

export const useStatsForm = (
  character: any,
  mode: FormMode = "view",
  users: Array<{ id: string; name: string; email: string }> = [],
  options?: UseStatsFormOptions,
) => {
  const { selectedCharacterId } = useCharacterContext();
  const router = useRouter();

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
    level: character?.level || 1,
    epicPoints: character?.epicPoints || 0,

    // Attributes
    strength: attributes?.strength || 1,
    agility: attributes?.agility || 1,
    willpower: attributes?.willpower || 1,
    luck: attributes?.luck || 1,
    intelligence: attributes?.intelligence || 1,

    // Domains
    physicalValue: domains?.physicalValue || 0,
    physicalEssence: domains?.physicalEssence || "",
    combatValue: domains?.combatValue || 0,
    combatEssence: domains?.combatEssence || "",
    socialValue: domains?.socialValue || 0,
    socialEssence: domains?.socialEssence || "",
    environmentalValue: domains?.environmentalValue || 0,
    environmentalEssence: domains?.environmentalEssence || "",
    stealthValue: domains?.stealthValue || 0,
    stealthEssence: domains?.stealthEssence || "",
    knowledgeValue: domains?.knowledgeValue || 0,
    knowledgeEssence: domains?.knowledgeEssence || "",
    technicalValue: domains?.technicalValue || 0,
    technicalEssence: domains?.technicalEssence || "",
    resourcesValue: domains?.resourcesValue || 0,
    resourcesEssence: domains?.resourcesEssence || "",
    demonicValue: domains?.demonicValue || 0,
    demonicEssence: domains?.demonicEssence || "",
    auraValue: domains?.auraValue || 0,
    auraEssence: domains?.auraEssence || "",

    // Combat Stats - Current values (only needed in edit/view mode, not create)
    physicalHealth: combatStats?.physicalHealth,
    maxPhysicalHealth: combatStats?.maxPhysicalHealth || 100,
    physicalResistance: combatStats?.physicalResistance,
    maxPhysicalResistance: combatStats?.maxPhysicalResistance || 100,
    mentalHealth: combatStats?.mentalHealth,
    maxMentalHealth: combatStats?.maxMentalHealth || 100,
    mentalResistance: combatStats?.mentalResistance,
    maxMentalResistance: combatStats?.maxMentalResistance || 100,
    initiative: combatStats?.initiative,
    maxInitiative: combatStats?.maxInitiative || 0,
    defense: combatStats?.defense,
    maxDefense: combatStats?.maxDefense || 0,
    attack: combatStats?.attack,
    maxAttack: combatStats?.maxAttack || 0,
    impact: combatStats?.impact,
    maxImpact: combatStats?.maxImpact || 0,
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
                label: "Dinamismo",
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
            columns: 2,
            fields: [
              createField("number", {
                name: "physicalValue",
                label: "Físico",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("text", {
                name: "physicalEssence",
                label: "Esencia Física",
                disabled: !isFieldEditable(mode),
                placeholder: "Describe el dominio físico",
              }),
              createField("number", {
                name: "combatValue",
                label: "Batalla",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("text", {
                name: "combatEssence",
                label: "Esencia de Batalla",
                disabled: !isFieldEditable(mode),
                placeholder: "Describe el dominio de combate",
              }),
              createField("number", {
                name: "socialValue",
                label: "Social",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("text", {
                name: "socialEssence",
                label: "Esencia Social",
                disabled: !isFieldEditable(mode),
                placeholder: "Describe el dominio social",
              }),
              createField("number", {
                name: "environmentalValue",
                label: "Ambiental",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("text", {
                name: "environmentalEssence",
                label: "Esencia Ambiental",
                disabled: !isFieldEditable(mode),
                placeholder: "Describe el dominio ambiental",
              }),
              createField("number", {
                name: "stealthValue",
                label: "Ocultación",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("text", {
                name: "stealthEssence",
                label: "Esencia de Ocultación",
                disabled: !isFieldEditable(mode),
                placeholder: "Describe el dominio de sigilo",
              }),
              createField("number", {
                name: "knowledgeValue",
                label: "Conocimiento",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("text", {
                name: "knowledgeEssence",
                label: "Esencia de Conocimiento",
                disabled: !isFieldEditable(mode),
                placeholder: "Describe el dominio de conocimiento",
              }),
              createField("number", {
                name: "technicalValue",
                label: "Técnico",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("text", {
                name: "technicalEssence",
                label: "Esencia Técnica",
                disabled: !isFieldEditable(mode),
                placeholder: "Describe el dominio técnico",
              }),
              createField("number", {
                name: "resourcesValue",
                label: "Recursos",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("text", {
                name: "resourcesEssence",
                label: "Esencia de Recursos",
                disabled: !isFieldEditable(mode),
                placeholder: "Describe el dominio de recursos",
              }),
              createField("number", {
                name: "demonicValue",
                label: "Demoníaco",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("text", {
                name: "demonicEssence",
                label: "Esencia Demoníaca",
                disabled: !isFieldEditable(mode),
                placeholder: "Describe el dominio demoníaco",
              }),
              createField("number", {
                name: "auraValue",
                label: "Aura",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),
              createField("text", {
                name: "auraEssence",
                label: "Esencia de Aura",
                disabled: !isFieldEditable(mode),
                placeholder: "Describe el dominio de aura",
              }),
            ],
          }),

          createSection({
            title: "Estadísticas de Combate",
            description: isCreateMode(mode)
              ? "Define los valores máximos. Los valores actuales se inicializarán automáticamente."
              : "Salud, resistencia y estadísticas de combate",
            columns: 2,
            fields: [
              // In CREATE mode, only show max* fields
              // In EDIT/VIEW mode, show both current and max fields

              // Physical Health
              ...(!isCreateMode(mode)
                ? [
                    createField("number", {
                      name: "physicalHealth",
                      label: "Salud Física",
                      disabled: !isFieldEditable(mode),
                      min: 0,
                      defaultValue: 100,
                    }),
                  ]
                : []),
              createField("number", {
                name: "maxPhysicalHealth",
                label: isCreateMode(mode)
                  ? "Salud Física Máxima"
                  : "Salud Física Máxima",
                disabled: !isFieldEditable(mode),
                min: 1,
                defaultValue: 100,
              }),

              // Physical Resistance
              ...(!isCreateMode(mode)
                ? [
                    createField("number", {
                      name: "physicalResistance",
                      label: "Resistencia Física",
                      disabled: !isFieldEditable(mode),
                      min: 0,
                      defaultValue: 100,
                    }),
                  ]
                : []),
              createField("number", {
                name: "maxPhysicalResistance",
                label: "Resistencia Física Máxima",
                disabled: !isFieldEditable(mode),
                min: 1,
                defaultValue: 100,
              }),

              // Mental Health
              ...(!isCreateMode(mode)
                ? [
                    createField("number", {
                      name: "mentalHealth",
                      label: "Salud Mental",
                      disabled: !isFieldEditable(mode),
                      min: 0,
                      defaultValue: 100,
                    }),
                  ]
                : []),
              createField("number", {
                name: "maxMentalHealth",
                label: "Salud Mental Máxima",
                disabled: !isFieldEditable(mode),
                min: 1,
                defaultValue: 100,
              }),

              // Mental Resistance
              ...(!isCreateMode(mode)
                ? [
                    createField("number", {
                      name: "mentalResistance",
                      label: "Resistencia Mental",
                      disabled: !isFieldEditable(mode),
                      min: 0,
                      defaultValue: 100,
                    }),
                  ]
                : []),
              createField("number", {
                name: "maxMentalResistance",
                label: "Resistencia Mental Máxima",
                disabled: !isFieldEditable(mode),
                min: 1,
                defaultValue: 100,
              }),

              // Initiative
              ...(!isCreateMode(mode)
                ? [
                    createField("number", {
                      name: "initiative",
                      label: "Iniciativa",
                      disabled: !isFieldEditable(mode),
                      min: 0,
                      defaultValue: 0,
                    }),
                  ]
                : []),
              createField("number", {
                name: "maxInitiative",
                label: isCreateMode(mode)
                  ? "Iniciativa Máxima"
                  : "Iniciativa Máxima",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),

              // Defense
              ...(!isCreateMode(mode)
                ? [
                    createField("number", {
                      name: "defense",
                      label: "Defensa",
                      disabled: !isFieldEditable(mode),
                      min: 0,
                      defaultValue: 0,
                    }),
                  ]
                : []),
              createField("number", {
                name: "maxDefense",
                label: isCreateMode(mode) ? "Defensa Máxima" : "Defensa Máxima",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),

              // Attack
              ...(!isCreateMode(mode)
                ? [
                    createField("number", {
                      name: "attack",
                      label: "Ataque",
                      disabled: !isFieldEditable(mode),
                      min: 0,
                      defaultValue: 0,
                    }),
                  ]
                : []),
              createField("number", {
                name: "maxAttack",
                label: isCreateMode(mode) ? "Ataque Máximo" : "Ataque Máximo",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),

              // Impact
              ...(!isCreateMode(mode)
                ? [
                    createField("number", {
                      name: "impact",
                      label: "Impacto",
                      disabled: !isFieldEditable(mode),
                      min: 0,
                      defaultValue: 0,
                    }),
                  ]
                : []),
              createField("number", {
                name: "maxImpact",
                label: isCreateMode(mode) ? "Impacto Máximo" : "Impacto Máximo",
                disabled: !isFieldEditable(mode),
                min: 0,
                defaultValue: 0,
              }),

              // Max Damage (no current value, always show)
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
          physicalValue: data.physicalValue,
          physicalEssence: data.physicalEssence,
          combatValue: data.combatValue,
          combatEssence: data.combatEssence,
          socialValue: data.socialValue,
          socialEssence: data.socialEssence,
          environmentalValue: data.environmentalValue,
          environmentalEssence: data.environmentalEssence,
          stealthValue: data.stealthValue,
          stealthEssence: data.stealthEssence,
          knowledgeValue: data.knowledgeValue,
          knowledgeEssence: data.knowledgeEssence,
          technicalValue: data.technicalValue,
          technicalEssence: data.technicalEssence,
          resourcesValue: data.resourcesValue,
          resourcesEssence: data.resourcesEssence,
          demonicValue: data.demonicValue,
          demonicEssence: data.demonicEssence,
          auraValue: data.auraValue,
          auraEssence: data.auraEssence,
        };

        // Add nested combat stats - Only max values for creation
        // Current values will be initialized by the backend service
        createPayload.combatStats = {
          maxPhysicalHealth: data.maxPhysicalHealth,
          maxPhysicalResistance: data.maxPhysicalResistance,
          maxMentalHealth: data.maxMentalHealth,
          maxMentalResistance: data.maxMentalResistance,
          maxInitiative: data.maxInitiative ?? 0,
          maxDefense: data.maxDefense ?? 0,
          maxAttack: data.maxAttack ?? 0,
          maxImpact: data.maxImpact ?? 0,
          maxDamage: data.maxDamage ?? 0,
        };

        const newCharacter = (await createCharacter.mutateAsync(
          createPayload,
        )) as Character;

        toast.success("Personaje creado correctamente");

        // Reset form and redirect
        form.reset();

        // Call onSuccess callback or navigate directly
        if (options?.onCreateSuccess && newCharacter?.id) {
          options.onCreateSuccess(newCharacter.id);
        } else if (newCharacter?.id) {
          router.push(`/characters/${newCharacter.id}`);
        }
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
            physicalValue: data.physicalValue,
            physicalEssence: data.physicalEssence,
            combatValue: data.combatValue,
            combatEssence: data.combatEssence,
            socialValue: data.socialValue,
            socialEssence: data.socialEssence,
            environmentalValue: data.environmentalValue,
            environmentalEssence: data.environmentalEssence,
            stealthValue: data.stealthValue,
            stealthEssence: data.stealthEssence,
            knowledgeValue: data.knowledgeValue,
            knowledgeEssence: data.knowledgeEssence,
            technicalValue: data.technicalValue,
            technicalEssence: data.technicalEssence,
            resourcesValue: data.resourcesValue,
            resourcesEssence: data.resourcesEssence,
            demonicValue: data.demonicValue,
            demonicEssence: data.demonicEssence,
            auraValue: data.auraValue,
            auraEssence: data.auraEssence,
          },
        };
      }

      // Add combat stats if they exist - Include both current and max values
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
            maxInitiative: data.maxInitiative,
            defense: data.defense,
            maxDefense: data.maxDefense,
            attack: data.attack,
            maxAttack: data.maxAttack,
            impact: data.impact,
            maxImpact: data.maxImpact,
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
