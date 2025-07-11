import { attributeService } from '@/services/attributes';
import { CreateAttributeRequest, UpdateAttributeRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useAttribute = (characterId: string) => {
  return useQuery({
    queryKey: ['attributes', 'character', characterId],
    queryFn: () => attributeService.getAttributeByCharacterId(characterId),
    enabled: !!characterId,
  });
};

export const useCreateAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateAttributeRequest) =>
      attributeService.createAttribute(data),
    onSuccess: (newAttribute) => {
      queryClient.invalidateQueries({
        queryKey: ['attributes', 'character', newAttribute.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['characters', newAttribute.characterId],
      });
    },
  });
};

export const useUpdateAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAttributeRequest }) =>
      attributeService.updateAttribute(id, data),
    onSuccess: (updatedAttribute) => {
      queryClient.invalidateQueries({
        queryKey: ['attributes', 'character', updatedAttribute.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['characters', updatedAttribute.characterId],
      });
    },
  });
};

export const useDeleteAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => attributeService.deleteAttribute(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['attributes'] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};

export const useUpsertAttribute = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      characterId,
      data,
    }: {
      characterId: string;
      data: Omit<CreateAttributeRequest, 'characterId'>;
    }) => attributeService.upsertAttribute(characterId, data),
    onSuccess: (attribute) => {
      queryClient.invalidateQueries({
        queryKey: ['attributes', 'character', attribute.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['characters', attribute.characterId],
      });
    },
  });
};
