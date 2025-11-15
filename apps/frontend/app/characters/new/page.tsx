"use client";

import { useRouter } from "next/navigation";
import { CharacterForm } from "../[id]/components/CharacterForm";
import { useCharacterForm } from "../[id]/hooks/use-character-form";

export default function NewCharacterPage() {
  const router = useRouter();

  // Initialize form in create mode with no character data
  const { form, handleSubmit, isLoading } = useCharacterForm(null, "create");

  // Handle successful creation
  const handleCreate = async (data: Parameters<typeof handleSubmit>[0]) => {
    try {
      const newCharacter = (await handleSubmit(data)) as
        | { id?: string }
        | undefined;
      if (newCharacter?.id) {
        // Redirect to the new character's detail page
        router.push(`/characters/${newCharacter.id}`);
      }
    } catch (error) {
      console.error("Error creating character:", error);
      // Error toast is already shown in the hook
    }
  };

  return (
    <CharacterForm
      form={form}
      onSubmit={handleCreate}
      isLoading={isLoading}
      mode="create"
    />
  );
}
