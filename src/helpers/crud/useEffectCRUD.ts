import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Effect } from '../../types/effect';
import {
  getAllEffects,
  createEffect as ipcCreateEffect,
  deleteEffect as ipcDeleteEffect,
  updateEffect as ipcUpdateEffect,
} from '../ipc/effect';

const fetchEffect = async (): Promise<Effect[]> => getAllEffects();
const getEffectById = async (id: number): Promise<Effect | undefined> => {
  const all = await getAllEffects();
  return all.find((e) => e.id === id);
};
const createEffect = async (data: Omit<Effect, 'id'>): Promise<Effect> =>
  ipcCreateEffect(data);
const updateEffect = async (
  data: Partial<Effect> & { id: number }
): Promise<Effect> => ipcUpdateEffect(data);
const deleteEffect = async (id: number): Promise<Effect> => ipcDeleteEffect(id);

export function useEffectList() {
  return useQuery({ queryKey: ['effect'], queryFn: fetchEffect });
}
export function useEffectItem(id: number) {
  return useQuery({
    queryKey: ['effect', id],
    queryFn: () => getEffectById(id),
    enabled: !!id,
  });
}
export function useCreateEffect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createEffect,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['effect'] }),
  });
}
export function useUpdateEffect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateEffect,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['effect'] }),
  });
}
export function useDeleteEffect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteEffect,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['effect'] }),
  });
}
