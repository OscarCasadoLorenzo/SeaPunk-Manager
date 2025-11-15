"use client";

import { useUsers } from "@/hooks";
import { FormBuilder, createFormConfig } from "@/utils/form-builder";
import { Button } from "@seapunk/ui";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { createInventoryFormSections } from "../config/inventory-form-config";
import { createNarrativeFormSections } from "../config/narrative-form-config";
import { createStatsFormSections } from "../config/stats-form-config";
import {
  type FormMode,
  isCreateMode,
  isFieldEditable,
  isViewMode,
} from "../types/form-mode";

interface CharacterFormProps {
  character?: any;
  form: UseFormReturn<any>;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
  mode?: FormMode;
  onModeChange?: (mode: FormMode) => void;
}

export const CharacterForm = ({
  character,
  form,
  onSubmit,
  isLoading = false,
  mode = "view",
  onModeChange,
}: CharacterFormProps) => {
  const [internalMode, setInternalMode] = useState<FormMode>(mode);

  // Fetch users for the player selector
  const { data: users = [] } = useUsers();

  // Use controlled mode if provided, otherwise use internal state
  const currentMode = onModeChange ? mode : internalMode;
  const handleModeChange = onModeChange || setInternalMode;

  // Get form state to check if there are changes
  const isDirty = form.formState.isDirty;
  const isValid = form.formState.isValid;

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isFieldEditable(currentMode) && isDirty) {
      // If exiting edit mode with unsaved changes, confirm
      const confirmDiscard = window.confirm(
        "¿Deseas descartar los cambios sin guardar?",
      );
      if (confirmDiscard) {
        form.reset();
        handleModeChange("view");
      }
    } else {
      handleModeChange(isViewMode(currentMode) ? "edit" : "view");
    }
  };

  // Handle form submission
  const handleFormSubmit = async (data: any) => {
    await onSubmit(data);
    // After successful submit in edit mode, return to view mode
    if (!isCreateMode(currentMode)) {
      handleModeChange("view");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    form.reset();
    if (!isCreateMode(currentMode)) {
      handleModeChange("view");
    }
  };

  // Get header text based on mode
  const getHeaderText = () => {
    if (isCreateMode(currentMode)) {
      return "Crear Nuevo Personaje";
    }
    if (isFieldEditable(currentMode)) {
      return `Editando: ${character?.characterName || "Personaje"}`;
    }
    return `Vista de: ${character?.characterName || "Personaje"}`;
  };

  // Get submit button text based on mode
  const getSubmitButtonText = () => {
    return isCreateMode(currentMode) ? "Crear Personaje" : "Guardar Cambios";
  };

  // Create form configuration with tabs
  const formConfig = createFormConfig({
    tabs: [
      {
        id: "stats",
        label: "Estadísticas",
        sections: createStatsFormSections(currentMode, users),
      },
      {
        id: "narrative",
        label: "Narrativa",
        sections: createNarrativeFormSections(currentMode),
      },
      {
        id: "inventory",
        label: "Inventario",
        sections: createInventoryFormSections(
          currentMode,
          character?.inventories || [],
        ),
      },
    ],
    submitButton: {
      text: getSubmitButtonText(),
      disabled: !isDirty || !isValid || isLoading,
      loading: isLoading,
    },
    cancelButton: {
      text: "Cancelar",
      onClick: handleCancel,
    },
  });

  return (
    <div className="space-y-6">
      {/* Header with character name and edit button */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            {isCreateMode(currentMode)
              ? "Nuevo Personaje"
              : "Ficha de Personaje"}
          </h1>
          <p className="text-muted-foreground">{getHeaderText()}</p>
        </div>

        {/* Only show edit button in view/edit modes, not in create mode */}
        {!isCreateMode(currentMode) && (
          <Button
            onClick={handleEditToggle}
            variant={isFieldEditable(currentMode) ? "outline" : "default"}
          >
            {isFieldEditable(currentMode)
              ? "Cancelar Edición"
              : "Editar Personaje"}
          </Button>
        )}
      </div>

      {/* Form Builder */}
      <FormBuilder
        config={formConfig}
        form={form}
        onSubmit={handleFormSubmit}
        isLoading={isLoading}
      />

      {/* Show dirty indicator when changes detected */}
      {isFieldEditable(currentMode) && isDirty && (
        <div className="text-sm text-amber-600 text-center p-4 bg-amber-50 border border-amber-200 rounded-lg">
          ⚠️ Tienes cambios sin guardar. Haz clic en "{getSubmitButtonText()}"
          para aplicarlos.
        </div>
      )}
    </div>
  );
};
