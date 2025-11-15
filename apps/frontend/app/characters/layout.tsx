"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useCharacterContext } from "@/contexts/CharacterContext";
import { useCharacters } from "@/hooks";
import { Character } from "@/types";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from "@seapunk/ui";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CharactersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data, isLoading, isError } = useCharacters();
  const { selectedCharacterId, setSelectedCharacterId } = useCharacterContext();

  useEffect(() => {
    console.log("CharacterList component mounted");
    console.log("Data:", data);
  }, [data]);

  const handleCharacterSelect = (characterId: string) => {
    setSelectedCharacterId(characterId);
    router.push(`/characters/${characterId}`);
  };

  const handleCreateNew = () => {
    setSelectedCharacterId(null);
    router.push("/characters/new");
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
                      className={`p-2 rounded cursor-pointer hover:bg-muted/50 transition-colors ${
                        selectedCharacterId === char.id ? "bg-muted" : ""
                      }`}
                      onClick={() => handleCharacterSelect(char.id)}
                    >
                      <span className="font-medium">{char.characterName}</span>
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
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
