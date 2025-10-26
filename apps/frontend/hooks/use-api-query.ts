import { fetchApi } from '@/lib/api';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from '@tanstack/react-query';

interface QueryConfig<TData>
  extends Omit<UseQueryOptions<TData>, 'queryKey' | 'queryFn'> {
  params?: Record<string, string>;
  headers?: HeadersInit;
}

export function useApiQuery<TData>(
  endpoint: string,
  config: QueryConfig<TData> = {}
) {
  const { params, headers, ...queryOptions } = config;

  return useQuery<TData>({
    queryKey: [endpoint, params],
    queryFn: () => fetchApi<TData>(endpoint, { headers }),
    ...queryOptions,
  });
}

export function useApiMutation<TData, TVariables = unknown>(
  endpoint: string,
  method: 'post' | 'put' | 'delete',
  config: Omit<UseMutationOptions<TData, Error, TVariables>, 'mutationFn'> = {}
) {
  return useMutation<TData, Error, TVariables>({
    mutationFn: (variables: TVariables) =>
      fetchApi<TData>(endpoint, {
        method,
        body: variables,
      }),
    ...config,
  });
}
