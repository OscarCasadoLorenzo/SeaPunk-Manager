"use client";

import { useRouter } from "next/navigation";
import { CharacterForm } from "../[id]/components/CharacterForm";

export default function NewCharacterPage() {
  const router = useRouter();

  const handleCreateSuccess = (characterId: string) => {
    router.push(`/characters/${characterId}`);
  };

  return <CharacterForm mode="create" onCreateSuccess={handleCreateSuccess} />;
}
