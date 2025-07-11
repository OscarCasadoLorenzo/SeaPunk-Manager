import { domainService } from '@/services/domains';
import { CreateDomainRequest, UpdateDomainRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useDomain = (characterId: string) => {
  return useQuery({
    queryKey: ['domains', 'character', characterId],
    queryFn: () => domainService.getDomainByCharacterId(characterId),
    enabled: !!characterId,
  });
};

export const useCreateDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDomainRequest) => domainService.createDomain(data),
    onSuccess: (newDomain) => {
      queryClient.invalidateQueries({
        queryKey: ['domains', 'character', newDomain.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['characters', newDomain.characterId],
      });
    },
  });
};

export const useUpdateDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateDomainRequest }) =>
      domainService.updateDomain(id, data),
    onSuccess: (updatedDomain) => {
      queryClient.invalidateQueries({
        queryKey: ['domains', 'character', updatedDomain.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['characters', updatedDomain.characterId],
      });
    },
  });
};

export const useDeleteDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => domainService.deleteDomain(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};

export const useUpsertDomain = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      characterId,
      data,
    }: {
      characterId: string;
      data: Omit<CreateDomainRequest, 'characterId'>;
    }) => domainService.upsertDomain(characterId, data),
    onSuccess: (domain) => {
      queryClient.invalidateQueries({
        queryKey: ['domains', 'character', domain.characterId],
      });
      queryClient.invalidateQueries({
        queryKey: ['characters', domain.characterId],
      });
    },
  });
};
