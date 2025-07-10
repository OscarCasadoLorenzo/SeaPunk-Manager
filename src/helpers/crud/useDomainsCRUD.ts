import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Domains } from '../../types/domains';
import {
  getAllDomains,
  createDomains as ipcCreateDomains,
  deleteDomains as ipcDeleteDomains,
  updateDomains as ipcUpdateDomains,
} from '../ipc/domains';

const fetchDomains = async (): Promise<Domains[]> => getAllDomains();
const getDomainsByCharacterId = async (
  characterId: number
): Promise<Domains | undefined> => {
  const all = await getAllDomains();
  return all.find((a) => a.characterId === characterId);
};
const createDomain = async (data: Domains): Promise<Domains> =>
  ipcCreateDomains(data);
const updateDomain = async (
  data: Partial<Domains> & { characterId: number }
): Promise<Domains> => ipcUpdateDomains(data);
const deleteDomain = async (characterId: number): Promise<Domains> =>
  ipcDeleteDomains(characterId);

export function useDomains() {
  return useQuery({ queryKey: ['domains'], queryFn: fetchDomains });
}
export function useDomain(characterId: number) {
  return useQuery({
    queryKey: ['domains', characterId],
    queryFn: () => getDomainsByCharacterId(characterId),
    enabled: !!characterId,
  });
}
export function useCreateDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createDomain,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['domains'] }),
  });
}
export function useUpdateDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateDomain,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['domains'] }),
  });
}
export function useDeleteDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteDomain,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['domains'] }),
  });
}
