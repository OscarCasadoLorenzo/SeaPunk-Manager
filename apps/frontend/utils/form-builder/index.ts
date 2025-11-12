// Main exports
export { FormBuilder } from './FormBuilder';
export { FormField } from './FormField';

// Types
export type {
  BaseFieldConfig,
  CheckboxFieldConfig,
  DateFieldConfig,
  FieldConfig,
  FieldProps,
  FileFieldConfig,
  FormBuilderProps,
  FormConfig,
  FormSectionConfig,
  FormTabConfig,
  NumberFieldConfig,
  RadioGroupFieldConfig,
  SelectFieldConfig,
  TextareaFieldConfig,
  TextFieldConfig,
} from './types';

// Utilities
export {
  createField,
  createFormConfig,
  createSection,
  createTab,
  createValidationSchema,
  extractDefaultValues,
} from './schema';

// Re-export default
export { default } from './FormBuilder';
