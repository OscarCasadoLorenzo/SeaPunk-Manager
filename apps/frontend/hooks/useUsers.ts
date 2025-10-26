import { useApiQuery, useApiMutation } from '@/hooks/use-api-query';
import { CreateUserRequest, UpdateUserRequest } from '@/types';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useUsers = () => {
  return useApiQuery(
    '/users',
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );
};

export const useUser = (id: string) => {
  return useApiQuery(
    `/users/${id}`,
    {
      enabled: !!id,
    }
  );

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, CreateUserRequest>(
    '/users',
    'post',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/users'] });
        toast.success('User created successfully!');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Failed to create user');
      },
    }
  );
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, { id: string; userData: UpdateUserRequest }>(
    '/users',
    'put',
    {
      onSuccess: (data) => {
        queryClient.invalidateQueries({ queryKey: ['/users'] });
        queryClient.invalidateQueries({ queryKey: ['/users', data.id] });
        toast.success('User updated successfully!');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Failed to update user');
      },
    }
  );
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useApiMutation<any, string>(
    '/users',
    'delete',
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['/users'] });
        toast.success('User deleted successfully!');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.error || 'Failed to delete user');
      },
    }
  );
};
