/**
 * Form mode type for character forms
 * - view: Read-only mode, all fields disabled
 * - edit: Edit mode, editable fields enabled
 * - create: Creation mode, all fields enabled (except auto-generated ones)
 */
export type FormMode = "view" | "edit" | "create";

/**
 * Helper function to determine if a field should be editable based on mode
 */
export const isFieldEditable = (mode: FormMode): boolean => {
  return mode === "edit" || mode === "create";
};

/**
 * Helper function to check if we're in create mode
 */
export const isCreateMode = (mode: FormMode): boolean => {
  return mode === "create";
};

/**
 * Helper function to check if we're in view mode
 */
export const isViewMode = (mode: FormMode): boolean => {
  return mode === "view";
};
