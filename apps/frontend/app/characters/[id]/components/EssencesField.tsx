"use client";

import { Button } from "@seapunk/ui";
import { Plus, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

interface EssencesFieldProps {
  disabled?: boolean;
}

export const EssencesField = ({ disabled = false }: EssencesFieldProps) => {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "essences",
  });

  const handleAddEssence = () => {
    append({ text: "" });
  };

  const handleRemoveEssence = (index: number) => {
    remove(index);
  };

  const getErrorMessage = (index: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const essencesErrors = errors.essences as any;
    return essencesErrors?.[index]?.text?.message;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Esencias del Personaje</h3>
          <p className="text-sm text-muted-foreground">
            Define las esencias fundamentales que caracterizan a tu personaje
            (máx. 200 caracteres cada una)
          </p>
        </div>
        {!disabled && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddEssence}
          >
            <Plus className="w-4 h-4 mr-2" />
            Añadir Esencia
          </Button>
        )}
      </div>

      <div className="space-y-3">
        {fields.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <p className="text-sm">
              No hay esencias definidas. Haz clic en &quot;Añadir Esencia&quot;
              para comenzar.
            </p>
          </div>
        ) : (
          fields.map((field, index) => (
            <div key={field.id} className="flex gap-2 items-start">
              <div className="flex-1">
                <div className="relative">
                  <textarea
                    {...register(`essences.${index}.text`)}
                    disabled={disabled}
                    placeholder="Describe una característica esencial del personaje..."
                    maxLength={200}
                    rows={2}
                    className={`w-full px-3 py-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      getErrorMessage(index)
                        ? "border-red-500"
                        : "border-gray-300"
                    } ${disabled ? "bg-gray-50 cursor-not-allowed" : ""}`}
                  />
                  {getErrorMessage(index) && (
                    <p className="text-sm text-red-600 mt-1">
                      {getErrorMessage(index)}
                    </p>
                  )}
                </div>
              </div>
              {!disabled && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveEssence(index)}
                  className="mt-1"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
