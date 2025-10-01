"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "./useAuth";

interface UserProfile {
  displayName?: string;
  bio?: string;
  preferences?: {
    theme?: "light" | "dark" | "system";
    notifications?: boolean;
  };
}

interface UserData {
  _id: string;
  id: string;
  email: string;
  name: string;
  image?: string;
  provider: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
  profile?: UserProfile;
}

export function useUser() {
  const { isAuthenticated, user: sessionUser } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user data from MongoDB
  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", "me"],
    queryFn: async (): Promise<UserData> => {
      const response = await fetch("/api/users/me");
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const resp = await response.json();
      console.log("🚀 ~ useUser ~ resp:", resp);
      return resp;
    },
    enabled: isAuthenticated,
  });

  // Update user profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profile: UserProfile) => {
      const response = await fetch("/api/users/me", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ profile }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch user data
      console.log("Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user", "me"] });
    },
  });

  return {
    user: userData,
    sessionUser,
    isLoading,
    error,
    isAuthenticated,
    updateProfile: updateProfileMutation.mutate,
    isUpdatingProfile: updateProfileMutation.isPending,
    updateProfileError: updateProfileMutation.error,
  };
}
