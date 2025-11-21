"use client";

import { useCharacterContext } from "@/contexts/CharacterContext";
import { useUpdateCharacter } from "@/hooks/useCharacters";
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
const narrativeFormSchema = z.object({
  physicalDescription: z.string().optional(),
  externalProfile: z.string().optional(),
  internalProfile: z.string().optional(),
  background: z.string().optional(),
  specialties: z.string().optional(),
});

type NarrativeFormData = z.infer<typeof narrativeFormSchema>;

export const useNarrativeForm = (character: any, mode: FormMode = "view") => {
  const { selectedCharacterId } = useCharacterContext();

  // Extract data from character object
  const narrative = character?.narrative;

  // Mutation hook
  const updateCharacter = useUpdateCharacter();

  // ✅ Extract default values
  const getDefaultValues = (): NarrativeFormData => ({
    physicalDescription: narrative?.physicalDescription || "",
    externalProfile: narrative?.externalProfile || "",
    internalProfile: narrative?.internalProfile || "",
    background: narrative?.background || "",
    specialties: narrative?.specialties || "",
  });

  // ✅ Form configuration inline
  const formConfig: FormConfig = React.useMemo(
    () =>
      createFormConfig({
        sections: [
          createSection({
            title: "Narrativa del Personaje",
            description: "Historia y descripción del personaje",
            columns: 1,
            fields: [
              createField("textarea", {
                name: "physicalDescription",
                label: "Descripción Física",
                disabled: !isFieldEditable(mode),
                placeholder: "Describe la apariencia física del personaje...",
                rows: 4,
              }),
              createField("textarea", {
                name: "externalProfile",
                label: "Perfil Externo",
                disabled: !isFieldEditable(mode),
                placeholder:
                  "Describe cómo se comporta el personaje en público...",
                rows: 4,
              }),
              createField("textarea", {
                name: "internalProfile",
                label: "Perfil Interno",
                disabled: !isFieldEditable(mode),
                placeholder:
                  "Describe los pensamientos y motivaciones del personaje...",
                rows: 4,
              }),
              createField("textarea", {
                name: "background",
                label: "Trasfondo",
                disabled: !isFieldEditable(mode),
                placeholder: "Cuenta la historia del personaje...",
                rows: 6,
              }),
              createField("textarea", {
                name: "specialties",
                label: "Especialidades",
                disabled: !isFieldEditable(mode),
                placeholder:
                  "Describe las habilidades especiales del personaje...",
                rows: 4,
              }),
            ],
          }),
        ],
      }),
    [mode],
  );

  // Form setup
  const form = useForm<NarrativeFormData>({
    resolver: zodResolver(narrativeFormSchema),
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
  const handleSubmit = async (data: NarrativeFormData): Promise<void> => {
    if (!selectedCharacterId) {
      toast.error("No hay personaje seleccionado");
      return;
    }

    try {
      const updatePayload: any = {
        narrative: {
          physicalDescription: data.physicalDescription || "",
          externalProfile: data.externalProfile || "",
          internalProfile: data.internalProfile || "",
          background: data.background || "",
          specialties: data.specialties || "",
        },
      };

      await updateCharacter.mutateAsync({
        id: selectedCharacterId,
        data: updatePayload,
      });

      toast.success("Narrativa actualizada correctamente");
    } catch (error) {
      toast.error("Error al actualizar la narrativa");
      console.error("Error updating narrative:", error);
    }
  };

  // Loading state
  const isLoading = updateCharacter.isPending;

  return {
    form,
    formConfig, // ✅ Config exposed from hook
    handleSubmit,
    isLoading,
  };
};
