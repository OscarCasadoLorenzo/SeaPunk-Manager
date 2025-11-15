import { useApiQuery } from "@/hooks/use-api-query";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

export const useUsers = () => {
  return useApiQuery<User[]>("/users");
};

export const useUser = (id: string) => {
  return useApiQuery<User>(`/users/${id}`, {
    enabled: !!id,
  });
};
