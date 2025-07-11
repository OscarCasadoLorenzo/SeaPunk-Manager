import { essenceService } from '@/services/essences';
import { CreateEssenceRequest, UpdateEssenceRequest } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useEssences = () => {
  return useQuery({
    queryKey: ['essences'],
    queryFn: essenceService.getEssences,
  });
};

export const useEssence = (id: string) => {
  return useQuery({
    queryKey: ['essences', id],
    queryFn: () => essenceService.getEssenceById(id),
    enabled: !!id,
  });
};

export const useEssenceByName = (name: string) => {
  return useQuery({
    queryKey: ['essences', 'name', name],
    queryFn: () => essenceService.getEssenceByName(name),
    enabled: !!name,
  });
};

export const useCreateEssence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateEssenceRequest) =>
      essenceService.createEssence(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essences'] });
    },
  });
};

export const useUpdateEssence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateEssenceRequest }) =>
      essenceService.updateEssence(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['essences'] });
      queryClient.invalidateQueries({ queryKey: ['essences', id] });
    },
  });
};

export const useDeleteEssence = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => essenceService.deleteEssence(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['essences'] });
    },
  });
};
