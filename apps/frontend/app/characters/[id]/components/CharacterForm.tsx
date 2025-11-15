"use client";

import { useUsers } from "@/hooks";
import { FormBuilder } from "@/utils/form-builder";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@seapunk/ui";
import { useState } from "react";
import { useInventoryForm } from "../hooks/use-inventory-form";
import { useNarrativeForm } from "../hooks/use-narrative-form";
import { useStatsForm } from "../hooks/use-stats-form";
import {
  type FormMode,
  isCreateMode,
  isFieldEditable,
  isViewMode,
} from "../types/form-mode";

interface CharacterFormProps {
  character?: any;
  isLoading?: boolean;
  mode?: FormMode;
  onModeChange?: (mode: FormMode) => void;
}

export const CharacterForm = ({
  character,
  isLoading = false,
  mode = "view",
  onModeChange,
}: CharacterFormProps) => {
  const [internalMode, setInternalMode] = useState<FormMode>(mode);
  const [activeTab, setActiveTab] = useState<string>("stats");

  // Fetch users for the player selector
  const { data: users = [] } = useUsers();

  // Use controlled mode if provided, otherwise use internal state
  const currentMode = onModeChange ? mode : internalMode;
  const handleModeChange = onModeChange || setInternalMode;

  // ✅ Use individual hooks for each tab
  const statsForm = useStatsForm(character, currentMode, users);
  const narrativeForm = useNarrativeForm(character, currentMode);
  const inventoryForm = useInventoryForm(character, currentMode);

  // Get combined dirty state
  const isDirty =
    statsForm.form.formState.isDirty ||
    narrativeForm.form.formState.isDirty ||
    inventoryForm.form.formState.isDirty;

  const isValid =
    statsForm.form.formState.isValid &&
    narrativeForm.form.formState.isValid &&
    inventoryForm.form.formState.isValid;

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isFieldEditable(currentMode) && isDirty) {
      // If exiting edit mode with unsaved changes, confirm
      const confirmDiscard = window.confirm(
        "¿Deseas descartar los cambios sin guardar?",
      );
      if (confirmDiscard) {
        statsForm.form.reset();
        narrativeForm.form.reset();
        inventoryForm.form.reset();
        handleModeChange("view");
      }
    } else {
      handleModeChange(isViewMode(currentMode) ? "edit" : "view");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    statsForm.form.reset();
    narrativeForm.form.reset();
    inventoryForm.form.reset();
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

      {/* Tabs for different form sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stats">Estadísticas</TabsTrigger>
          <TabsTrigger value="narrative">Narrativa</TabsTrigger>
          <TabsTrigger value="inventory">Inventario</TabsTrigger>
        </TabsList>

        <TabsContent value="stats" className="mt-6">
          <FormBuilder
            config={statsForm.formConfig}
            form={statsForm.form}
            onSubmit={statsForm.handleSubmit}
            isLoading={statsForm.isLoading}
          >
            {/* Custom buttons for stats tab */}
            {isFieldEditable(currentMode) && (
              <div className="flex gap-3 justify-end pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !statsForm.form.formState.isDirty || !isValid || isLoading
                  }
                >
                  {isLoading ? "Guardando..." : getSubmitButtonText()}
                </Button>
              </div>
            )}
          </FormBuilder>
        </TabsContent>

        <TabsContent value="narrative" className="mt-6">
          <FormBuilder
            config={narrativeForm.formConfig}
            form={narrativeForm.form}
            onSubmit={narrativeForm.handleSubmit}
            isLoading={narrativeForm.isLoading}
          >
            {/* Custom buttons for narrative tab */}
            {isFieldEditable(currentMode) && (
              <div className="flex gap-3 justify-end pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !narrativeForm.form.formState.isDirty ||
                    !isValid ||
                    isLoading
                  }
                >
                  {isLoading ? "Guardando..." : getSubmitButtonText()}
                </Button>
              </div>
            )}
          </FormBuilder>
        </TabsContent>

        <TabsContent value="inventory" className="mt-6">
          <FormBuilder
            config={inventoryForm.formConfig}
            form={inventoryForm.form}
            onSubmit={inventoryForm.handleSubmit}
            isLoading={inventoryForm.isLoading}
          >
            {/* Custom buttons for inventory tab */}
            {isFieldEditable(currentMode) && (
              <div className="flex gap-3 justify-end pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={
                    !inventoryForm.form.formState.isDirty ||
                    !isValid ||
                    isLoading
                  }
                >
                  {isLoading ? "Guardando..." : getSubmitButtonText()}
                </Button>
              </div>
            )}
          </FormBuilder>
        </TabsContent>
      </Tabs>

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
