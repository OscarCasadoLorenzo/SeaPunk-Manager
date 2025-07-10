import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createCharacter,
  deleteCharacter,
  getCharacters,
  updateCharacter,
} from '../ipc/characters';

export function useCharacters() {
  return useQuery({ queryKey: ['characters'], queryFn: getCharacters });
}

export function useCreateCharacter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCharacter,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['characters'] }),
  });
}

export function useUpdateCharacter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCharacter,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['characters'] }),
  });
}

export function useDeleteCharacter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCharacter,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['characters'] }),
  });
}
