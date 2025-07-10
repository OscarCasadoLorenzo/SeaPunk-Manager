import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Player } from '../../types/players';
import {
  getAllPlayers,
  createPlayer as ipcCreatePlayer,
  deletePlayer as ipcDeletePlayer,
  updatePlayer as ipcUpdatePlayer,
} from '../ipc/players';

const fetchPlayers = async (): Promise<Player[]> => getAllPlayers();
const getPlayerById = async (id: number): Promise<Player | undefined> => {
  const all = await getAllPlayers();
  return all.find((p) => p.id === id);
};
const createPlayer = async (data: Omit<Player, 'id'>): Promise<Player> =>
  ipcCreatePlayer(data);
const updatePlayer = async (
  data: Partial<Player> & { id: number }
): Promise<Player> => ipcUpdatePlayer(data);
const deletePlayer = async (id: number): Promise<Player> => ipcDeletePlayer(id);

export function usePlayers() {
  return useQuery({ queryKey: ['players'], queryFn: fetchPlayers });
}
export function usePlayer(id: number) {
  return useQuery({
    queryKey: ['players', id],
    queryFn: () => getPlayerById(id),
    enabled: !!id,
  });
}
export function useCreatePlayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createPlayer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['players'] }),
  });
}
export function useUpdatePlayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updatePlayer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['players'] }),
  });
}
export function useDeletePlayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePlayer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['players'] }),
  });
}
