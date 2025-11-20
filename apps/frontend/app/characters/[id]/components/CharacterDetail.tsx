"use client";

import { useCharacterContext } from "@/contexts/CharacterContext";
import { useCharacterWithDetails } from "@/hooks/useCharacters";
import { Card, CardContent, Skeleton } from "@seapunk/ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { CharacterForm } from "./CharacterForm";

interface CharacterDetailProps {
  id: string;
}

export default function CharacterDetail({ id }: CharacterDetailProps) {
  const { selectedCharacterId, setSelectedCharacterId } = useCharacterContext();
  const router = useRouter();

  // Set the selected character ID from the URL param
  useEffect(() => {
    if (id && id !== selectedCharacterId) {
      setSelectedCharacterId(id);
    }
  }, [id, selectedCharacterId, setSelectedCharacterId]);

  const {
    data: character,
    isLoading: characterLoading,
    error,
  } = useCharacterWithDetails(selectedCharacterId || id);

  // Handle errors - 403 will be handled by the API layer redirecting to /unauthorized
  // But we can show a generic error message for other errors
  if (error && !characterLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-4 w-full max-w-4xl mx-auto">
        <Card className="w-full">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Error Loading Character
            </h2>
            <p className="text-gray-600 mb-4">
              There was an error loading this character. You may not have
              permission to view it.
            </p>
            <button
              onClick={() => router.push("/characters")}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Back to Characters
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
      <CharacterForm character={character} mode="view" />
    </div>
  );
}
