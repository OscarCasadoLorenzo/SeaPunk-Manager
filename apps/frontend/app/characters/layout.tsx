"use client";

import { DeleteCharacterModal } from "@/components/DeleteCharacterModal";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useCharacterContext } from "@/contexts/CharacterContext";
import { useCharacters, useDeleteCharacter } from "@/hooks";
import { Character } from "@/types";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@seapunk/ui";
import { Plus, Trash2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CharactersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading, isError } = useCharacters();
  const { selectedCharacterId, setSelectedCharacterId } = useCharacterContext();
  const deleteCharacter = useDeleteCharacter();

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    characterId: string;
    characterName: string;
  }>({
    isOpen: false,
    characterId: "",
    characterName: "",
  });

  useEffect(() => {
    console.log("CharacterList component mounted");
    console.log("Data:", data);
  }, [data]);

  const handleCharacterSelect = (characterId: string) => {
    console.log("=== handleCharacterSelect called ===");
    console.log("Character ID:", characterId);
    console.log("Current pathname:", pathname);
    console.log("Current selectedCharacterId:", selectedCharacterId);

    setSelectedCharacterId(characterId);

    // Force hard navigation if on /new page, otherwise use router
    if (pathname === "/characters/new") {
      console.log("On /new page, forcing hard navigation");
      //TODO: Replace by next/navigation method when available
      window.location.href = `/characters/${characterId}`;
    } else {
      router.push(`/characters/${characterId}`);
      console.log("Navigation triggered to:", `/characters/${characterId}`);
    }
  };

  const handleCreateNew = () => {
    setSelectedCharacterId(null);
    router.push("/characters/new");
  };

  const handleDeleteClick = (
    e: React.MouseEvent,
    characterId: string,
    characterName: string,
  ) => {
    e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      characterId,
      characterName,
    });
  };

  const handleConfirmDelete = async (characterId: string) => {
    try {
      await deleteCharacter.mutateAsync(characterId);
      setDeleteModal({ isOpen: false, characterId: "", characterName: "" });

      // If the deleted character was selected, redirect to characters page
      if (selectedCharacterId === characterId) {
        setSelectedCharacterId(null);
        router.push("/characters");
      }
    } catch (error) {
      console.error("Error deleting character:", error);
    }
  };

  const handleCloseModal = () => {
    setDeleteModal({ isOpen: false, characterId: "", characterName: "" });
  };

  return (
    <ProtectedRoute>
      <div className="flex gap-4 h-full">
        {/* Character List Sidebar - Always visible */}
        <Card className="w-80 flex-shrink-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Lista de Personajes</CardTitle>
              <Button
                onClick={handleCreateNew}
                size="sm"
                className="flex items-center gap-2"
                title="Crear Nuevo Personaje"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : isError ? (
              <div className="text-red-500">Error al cargar personajes.</div>
            ) : (
              <div className="space-y-2">
                {data && data.length > 0 ? (
                  data.map((char: Character) => (
                    <div
                      key={char.id}
                      className={`p-2 rounded cursor-pointer hover:bg-muted/50 transition-colors flex items-center justify-between group ${
                        selectedCharacterId === char.id ? "bg-muted" : ""
                      }`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleCharacterSelect(char.id);
                      }}
                    >
                      <span className="font-medium">{char.characterName}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        className=" h-8 w-8 p-0"
                        onClick={(e) =>
                          handleDeleteClick(e, char.id, char.characterName)
                        }
                        title="Eliminar personaje"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-4">
                    No hay personajes.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Main Content Area - Renders child routes */}
        <div key={pathname} className="flex-1 overflow-auto">
          {children}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteCharacterModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseModal}
        characterName={deleteModal.characterName}
        characterId={deleteModal.characterId}
        onConfirmDelete={handleConfirmDelete}
        isDeleting={deleteCharacter.isPending}
      />
    </ProtectedRoute>
  );
}
