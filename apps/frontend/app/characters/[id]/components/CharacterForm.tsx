"use client";

import { useUsers } from "@/hooks";
import { FormBuilder } from "@/utils/form-builder";
import { Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@seapunk/ui";
import { type ReactNode } from "react";
import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";
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

interface TabConfig {
  id: string;
  label: string;
  form: UseFormReturn<any>;
  formConfig: any;
  handleSubmit: (data: any) => Promise<void>;
  isLoading: boolean;
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

  // Individual hooks for each tab
  const statsForm = useStatsForm(character, currentMode, users);
  const narrativeForm = useNarrativeForm(character, currentMode);
  const inventoryForm = useInventoryForm(character, currentMode);

  // Tab configuration
  const tabs: TabConfig[] = [
    {
      id: "stats",
      label: "Estadísticas",
      ...statsForm,
    },
    {
      id: "narrative",
      label: "Narrativa",
      ...narrativeForm,
    },
    {
      id: "inventory",
      label: "Inventario",
      ...inventoryForm,
    },
  ];

  // Get combined dirty state
  const isDirty = tabs.some((tab) => tab.form.formState.isDirty);
  const isValid = tabs.every((tab) => tab.form.formState.isValid);

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isFieldEditable(currentMode) && isDirty) {
      const confirmDiscard = window.confirm(
        "¿Deseas descartar los cambios sin guardar?",
      );
      if (confirmDiscard) {
        tabs.forEach((tab) => tab.form.reset());
        handleModeChange("view");
      }
    } else {
      handleModeChange(isViewMode(currentMode) ? "edit" : "view");
    }
  };

  // Handle cancel
  const handleCancel = () => {
    tabs.forEach((tab) => tab.form.reset());
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

  // Render form actions
  const renderFormActions = (tabForm: UseFormReturn<any>): ReactNode => {
    if (!isFieldEditable(currentMode)) return null;

    return (
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
          disabled={!tabForm.formState.isDirty || !isValid || isLoading}
        >
          {isLoading ? "Guardando..." : getSubmitButtonText()}
        </Button>
      </div>
    );
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
        <TabsList className={`grid w-full grid-cols-${tabs.length}`}>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id} className="mt-6">
            <FormBuilder
              config={tab.formConfig}
              form={tab.form}
              onSubmit={tab.handleSubmit}
              isLoading={tab.isLoading}
            >
              {renderFormActions(tab.form)}
            </FormBuilder>
          </TabsContent>
        ))}
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
