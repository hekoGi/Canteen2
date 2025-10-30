import { createContext, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export interface AuthUser {
  id: string;
  username: string;
  isApproved: boolean;
  isAdmin: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading } = useQuery<AuthUser | null>({
    queryKey: ['/api/auth/me'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const res = await apiRequest('POST', '/api/auth/login', { username, password });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', '/api/auth/logout', {});
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/me'], null);
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const res = await apiRequest('POST', '/api/auth/register', { username, password });
      return res.json();
    },
  });

  const login = async (username: string, password: string) => {
    await loginMutation.mutateAsync({ username, password });
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const register = async (username: string, password: string) => {
    await registerMutation.mutateAsync({ username, password });
  };

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}
