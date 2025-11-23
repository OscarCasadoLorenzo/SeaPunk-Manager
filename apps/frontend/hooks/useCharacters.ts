import { useApiMutation, useApiQuery } from "@/hooks/use-api-query";
import { fetchApi } from "@/lib/api";
import { extractData } from "@/lib/pagination";
import { Character, MaybePaginated } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to fetch characters with pagination support
 * - ADMIN users: Returns all characters (paginated)
 * - PLAYER/MASTER users: Returns only their own characters (paginated)
 *
 * The hook automatically extracts the data array from paginated responses
 * for backward compatibility with existing code.
 *
 * @param params - Optional query parameters for pagination and filtering
 */
export const useCharacters = (params?: {
  limit?: number;
  offset?: number;
  sort?: string;
  fields?: string;
  search?: string;
}) => {
  const query = useApiQuery<MaybePaginated<Character>>("/characters", {
    params,
  });

  // Extract just the data array for backward compatibility
  return {
    ...query,
    data: query.data ? extractData(query.data) : undefined,
  } as const;
};
export const useCharacter = (id: string) => {
  return useApiQuery<Character>(`/characters/${id}`, {
    enabled: !!id,
  });
};

export const useCharacterWithDetails = (id: string) => {
  return useApiQuery<Character>(`/characters/${id}`, {
    enabled: !!id,
  });
};

export const useCharactersByPlayer = (playerId: string) => {
  return useApiQuery(`/characters/player/${playerId}`, {
    enabled: !!playerId,
  });
};

export const useCreateCharacter = () => {
  const queryClient = useQueryClient();

  return useApiMutation("/characters", "post", {
    onSuccess: (newCharacter: Character) => {
      queryClient.invalidateQueries({ queryKey: ["/characters"] });
      queryClient.invalidateQueries({
        queryKey: ["/characters/player", newCharacter.userId],
      });
      queryClient.invalidateQueries({
        queryKey: ["/players", newCharacter.userId],
      });
    },
  });
};

export const useUpdateCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Character>;
    }) => {
      return fetchApi<Character>(`/characters/${id}`, {
        method: "PUT",
        body: data,
      });
    },
    onSuccess: (updatedCharacter: Character, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["/characters"] });
      queryClient.invalidateQueries({ queryKey: [`/characters/${id}`] });
      queryClient.invalidateQueries({
        queryKey: ["/characters/player", updatedCharacter.userId],
      });
    },
  });
};

export const useDeleteCharacter = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return fetchApi(`/characters/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: (_data, characterId) => {
      // Invalidate all character-related queries
      queryClient.invalidateQueries({
        queryKey: ["/characters"],
        refetchType: "all",
      });
      queryClient.invalidateQueries({
        queryKey: [`/characters/${characterId}`],
      });
      queryClient.invalidateQueries({
        queryKey: ["/players"],
      });
    },
  });
};
