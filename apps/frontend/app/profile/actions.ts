import { User } from "@/contexts/AuthContext";
import { fetchApi } from "@/lib/api";

export interface UpdateProfileData {
  name?: string;
  username?: string;
  email?: string;
  language?: string;
  currentPassword?: string; // Required when updating email
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export async function updateProfile(
  userId: string,
  data: UpdateProfileData,
): Promise<User> {
  return fetchApi<User>(`/users/${userId}/profile`, {
    method: "PATCH",
    body: data,
  });
}

export async function changePassword(
  userId: string,
  data: ChangePasswordData,
): Promise<{ message: string }> {
  return fetchApi<{ message: string }>(`/users/${userId}/password`, {
    method: "PATCH",
    body: data,
  });
}
