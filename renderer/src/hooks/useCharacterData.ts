import { Character } from '@/components/types';
import { mockCharacters } from '@/fixtures/characters';
import { useCharacters, useUpdateCharacter } from '@/hooks/useCharacters';
import { transformApiCharacterToComponent } from '@/utils/characterTransforms';
import { useEffect, useState } from 'react';

/**
 * Custom hook that manages character data, with fallback to mock data during development
 */
export function useCharacterData() {
  const [characters, setCharacters] = useState<Character[]>(mockCharacters);
  const [isUsingMockData, setIsUsingMockData] = useState(true);

  // Try to fetch real data
  const { data: apiCharacters, isLoading, error, isError } = useCharacters();

  const updateCharacterMutation = useUpdateCharacter();

  // Switch to real data when available
  useEffect(() => {
    if (apiCharacters && !isLoading && !isError) {
      const transformedCharacters = apiCharacters.map(
        transformApiCharacterToComponent
      );
      setCharacters(transformedCharacters);
      setIsUsingMockData(false);
      console.log('Switched to real character data', transformedCharacters);
    } else if (isError) {
      console.warn(
        'Failed to load real character data, using mock data:',
        error
      );
      setCharacters(mockCharacters);
      setIsUsingMockData(true);
    }
  }, [apiCharacters, isLoading, isError, error]);

  const handleSaveCharacter = async (character: Character) => {
    if (isUsingMockData) {
      // Update mock data locally
      setCharacters((prev) => {
        const existing = prev.find((c) => c.id === character.id);
        if (existing) {
          return prev.map((c) => (c.id === character.id ? character : c));
        } else {
          return [...prev, character];
        }
      });
    } else {
      // Use real API
      try {
        if (characters.find((c) => c.id === character.id)) {
          // Update existing character
          await updateCharacterMutation.mutateAsync({
            id: character.id,
            data: {
              characterName: character.characterName,
              archetype: character.archetype,
              faction: character.faction,
              race: character.race,
              level: character.level,
              category: character.category,
              epicPoints: character.puntosEpica,
              type: character.type,
              isNPC: character.isNPC,
              isVisible: character.visible,
            },
          });
        } else {
          // TODO: Implement create character when needed
          console.warn('Creating new characters via API not implemented yet');
        }
      } catch (error) {
        console.error('Failed to save character:', error);
        // Fallback to mock data update
        setCharacters((prev) => {
          const existing = prev.find((c) => c.id === character.id);
          if (existing) {
            return prev.map((c) => (c.id === character.id ? character : c));
          } else {
            return [...prev, character];
          }
        });
      }
    }
  };

  const toggleCharacterVisibility = (id: string) => {
    if (isUsingMockData) {
      setCharacters((chars) =>
        chars.map((char) =>
          char.id === id ? { ...char, visible: !char.visible } : char
        )
      );
    } else {
      // Update via API
      const character = characters.find((c) => c.id === id);
      if (character) {
        updateCharacterMutation.mutate({
          id,
          data: {
            isVisible: !character.visible,
          },
        });
      }
    }
  };

  return {
    characters,
    isLoading,
    isUsingMockData,
    error,
    handleSaveCharacter,
    toggleCharacterVisibility,
  };
}
