"use client";

import { useCharacterContext } from "@/contexts/CharacterContext";
import { useCharacterWithDetails } from "@/hooks/useCharacters";
import { Card, CardContent, Skeleton } from "@seapunk/ui";
import { useEffect } from "react";
import { useCharacterForm } from "../hooks/use-character-form";
import { CharacterForm } from "./CharacterForm";

interface CharacterDetailProps {
  id: string;
}

export default function CharacterDetail({ id }: CharacterDetailProps) {
  const { selectedCharacterId, setSelectedCharacterId } = useCharacterContext();

  // Set the selected character ID from the URL param
  useEffect(() => {
    if (id && id !== selectedCharacterId) {
      setSelectedCharacterId(id);
    }
  }, [id, selectedCharacterId, setSelectedCharacterId]);

  const { data: character, isLoading: characterLoading } =
    useCharacterWithDetails(selectedCharacterId || id);

  // Initialize form hook with character data in view mode by default
  const { form, handleSubmit, isLoading } = useCharacterForm(character, "view");

  if (characterLoading || !character) {
    return (
      <div className="flex flex-col items-center justify-center p-4 w-full max-w-4xl mx-auto">
        <Card className="w-full">
          <CardContent>
            <Skeleton className="h-96 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col p-4 w-full max-w-6xl mx-auto">
      <CharacterForm
        character={character}
        form={form}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        mode="view"
      />
    </div>
  );
}
