import {
  createField,
  createSection,
  type FormSectionConfig,
} from "@/utils/form-builder";
import { type FormMode, isFieldEditable } from "../types/form-mode";

export const createNarrativeFormSections = (
  mode: FormMode,
): FormSectionConfig[] => {
  return [
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
          placeholder: "Describe cómo se comporta el personaje en público...",
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
          placeholder: "Describe las habilidades especiales del personaje...",
          rows: 4,
        }),
      ],
    }),
  ];
};
