import {
  createField,
  createSection,
  type FormSectionConfig,
} from '@/utils/form-builder';

export const createNarrativeFormSections = (
  isEditMode: boolean
): FormSectionConfig[] => {
  return [
    createSection({
      title: 'Narrativa del Personaje',
      description: 'Historia y descripción del personaje',
      columns: 1,
      fields: [
        createField('textarea', {
          name: 'physicalDescription',
          label: 'Descripción Física',
          disabled: !isEditMode,
          placeholder: 'Describe la apariencia física del personaje...',
          rows: 4,
        }),
        createField('textarea', {
          name: 'externalProfile',
          label: 'Perfil Externo',
          disabled: !isEditMode,
          placeholder: 'Describe cómo se comporta el personaje en público...',
          rows: 4,
        }),
        createField('textarea', {
          name: 'internalProfile',
          label: 'Perfil Interno',
          disabled: !isEditMode,
          placeholder:
            'Describe los pensamientos y motivaciones del personaje...',
          rows: 4,
        }),
        createField('textarea', {
          name: 'background',
          label: 'Trasfondo',
          disabled: !isEditMode,
          placeholder: 'Cuenta la historia del personaje...',
          rows: 6,
        }),
        createField('textarea', {
          name: 'specialties',
          label: 'Especialidades',
          disabled: !isEditMode,
          placeholder: 'Describe las habilidades especiales del personaje...',
          rows: 4,
        }),
      ],
    }),
  ];
};
