import { Character } from '@/components/types';
import { mockCharacters } from '@/fixtures/characters';
import { useApiMutation } from '@/hooks/use-api-query';
import { useCharacters } from '@/hooks/useCharacters';
import { transformApiCharacterToComponent } from '@/utils/characterTransforms';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

/**
 * Custom hook that manages character data, with fallback to mock data during development
 */
export function useCharacterData() {
  const [characters, setCharacters] = useState<Character[]>(mockCharacters);
  const [isUsingMockData, setIsUsingMockData] = useState(true);
  const queryClient = useQueryClient();

  // Try to fetch real data
  const { data: apiCharacters, isLoading, error, isError } = useCharacters();

  // Use optimized mutation with proper cache invalidation
  const updateCharacterMutation = useApiMutation<
    any,
    { id: string; data: Partial<Character> }
  >('/characters', 'put', {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/characters'] });
      queryClient.invalidateQueries({ queryKey: ['/characters', data.id] });
    },
    onError: (error) => {
      console.error('Failed to update character:', error);
    },
  });

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
      // Update mock data locally with optimistic updates
      setCharacters((prev) => {
        const existing = prev.find((c) => c.id === character.id);
        if (existing) {
          return prev.map((c) => (c.id === character.id ? character : c));
        } else {
          return [...prev, character];
        }
      });
      return;
    }

    try {
      if (characters.find((c) => c.id === character.id)) {
        // Update existing character with optimistic updates
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
        // Fallback to mock data for now
        console.info(
          'API endpoint for character creation pending, using mock data temporarily'
        );
        setCharacters((prev) => [...prev, character]);
      }
    } catch (error) {
      console.error('Failed to save character:', error);
      // Rollback optimistic update on error
      setCharacters((prev) => {
        const existing = prev.find((c) => c.id === character.id);
        if (existing) {
          return prev.map((c) => (c.id === character.id ? character : c));
        } else {
          return [...prev, character];
        }
      });
    }
  };

  const toggleCharacterVisibility = (id: string) => {
    // Optimistic update locally first
    setCharacters((chars) =>
      chars.map((char) =>
        char.id === id ? { ...char, visible: !char.visible } : char
      )
    );

    if (!isUsingMockData) {
      const character = characters.find((c) => c.id === id);
      if (character) {
        // Then update via API
        updateCharacterMutation.mutate(
          {
            id,
            data: {
              isVisible: !character.visible,
            },
          },
          {
            onError: () => {
              // Rollback on error
              setCharacters((chars) =>
                chars.map((char) =>
                  char.id === id
                    ? { ...char, visible: character.visible }
                    : char
                )
              );
            },
          }
        );
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
