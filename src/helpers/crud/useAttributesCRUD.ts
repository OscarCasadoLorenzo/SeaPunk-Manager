import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Attribute } from '../../types/attributes';
import {
  getAllAttributes,
  createAttribute as ipcCreateAttribute,
  deleteAttribute as ipcDeleteAttribute,
  updateAttribute as ipcUpdateAttribute,
} from '../ipc/attributes';

const fetchAttributes = async (): Promise<Attribute[]> => getAllAttributes();
const getAttributesByCharacterId = async (
  characterId: number
): Promise<Attribute | undefined> => {
  const all = await getAllAttributes();
  return all.find((a) => a.characterId === characterId);
};
const createAttribute = async (data: Attribute): Promise<Attribute> =>
  ipcCreateAttribute(data);
const updateAttribute = async (
  data: Partial<Attribute> & { characterId: number }
): Promise<Attribute> => ipcUpdateAttribute(data);
const deleteAttribute = async (characterId: number): Promise<Attribute> =>
  ipcDeleteAttribute(characterId);

export function useAttributes() {
  return useQuery({ queryKey: ['attributes'], queryFn: fetchAttributes });
}
export function useAttribute(characterId: number) {
  return useQuery({
    queryKey: ['attributes', characterId],
    queryFn: () => getAttributesByCharacterId(characterId),
    enabled: !!characterId,
  });
}
export function useCreateAttribute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAttribute,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['attributes'] }),
  });
}
export function useUpdateAttribute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAttribute,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['attributes'] }),
  });
}
export function useDeleteAttribute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAttribute,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['attributes'] }),
  });
}
