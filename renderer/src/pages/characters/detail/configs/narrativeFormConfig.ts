import {
  createField,
  createFormConfig,
  createSection,
} from '@/utils/form-builder';

export const createNarrativeFormConfig = () => {
  return createFormConfig({
    title: 'Narrativa del Personaje',
    description: 'Información narrativa y descriptiva del personaje',
    sections: [
      createSection({
        title: 'Información Narrativa',
        columns: 1,
        fields: [
          createField('textarea', {
            name: 'physicalDescription',
            label: 'Descripción física',
            placeholder: 'Describe la apariencia física del personaje...',
            rows: 3,
          }),
          createField('textarea', {
            name: 'externalProfile',
            label: 'Perfil externo',
            placeholder: 'Cómo actúa y se presenta el personaje ante otros...',
            rows: 4,
          }),
          createField('textarea', {
            name: 'internalProfile',
            label: 'Perfil interno',
            placeholder:
              'Los pensamientos, motivaciones y personalidad interna...',
            rows: 4,
          }),
          createField('textarea', {
            name: 'background',
            label: 'Trasfondo',
            placeholder: 'Historia personal y eventos importantes...',
            rows: 5,
          }),
          createField('textarea', {
            name: 'specialties',
            label: 'Especialidades y poderes',
            placeholder: 'Habilidades especiales, poderes únicos...',
            rows: 4,
          }),
        ],
      }),
    ],
    submitButton: {
      text: 'Guardar Narrativa',
      className: 'bg-green-600 hover:bg-green-700',
    },
  });
};

export const narrativeFormConfig = createNarrativeFormConfig();
