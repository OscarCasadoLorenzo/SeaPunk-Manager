"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Input,
  Label,
} from "@seapunk/ui";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";

interface DeleteCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  characterName: string;
  characterId: string;
  onConfirmDelete: (characterId: string) => void;
  isDeleting?: boolean;
}

export function DeleteCharacterModal({
  isOpen,
  onClose,
  characterName,
  characterId,
  onConfirmDelete,
  isDeleting = false,
}: DeleteCharacterModalProps) {
  const [confirmationInput, setConfirmationInput] = useState("");

  const handleClose = () => {
    setConfirmationInput("");
    onClose();
  };

  const handleConfirm = () => {
    if (confirmationInput === characterName) {
      onConfirmDelete(characterId);
      setConfirmationInput("");
    }
  };

  const isConfirmationValid = confirmationInput === characterName;

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="h-5 w-5" />
            Eliminar Personaje
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <p>
                Esta acción no se puede deshacer. Se eliminará permanentemente
                el personaje <strong>{characterName}</strong> y todos sus datos
                asociados.
              </p>
              <div className="space-y-2">
                <Label htmlFor="confirmation-input">
                  Para confirmar, escribe el nombre del personaje:{" "}
                  <strong>{characterName}</strong>
                </Label>
                <Input
                  id="confirmation-input"
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  placeholder={characterName}
                  className="font-mono"
                  disabled={isDeleting}
                  autoComplete="off"
                />
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose} disabled={isDeleting}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={!isConfirmationValid || isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Eliminando..." : "Eliminar Personaje"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
