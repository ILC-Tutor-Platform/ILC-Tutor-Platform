import {create} from "zustand";
import {persist} from "zustand/middleware";
import type { UserPayload } from "@/types";

interface AuthState {
    set: any;
    user: UserPayload | null;
    refreshToken: string | null;
    isHydrated: boolean;
    setUser: (user: UserPayload | null) => void;
    setRefreshToken: (token: string | null) => void;
    clearAuth: () => void;
  }

export const useAuthStore = create<AuthState>()(
    persist(
      (set) => ({
        set,
        user: null,
        refreshToken: null,
        isHydrated: false,
        setUser: (user) => set({ user }),
        setRefreshToken: (refreshToken) => set({ refreshToken }),
        clearAuth: () => set({ user: null, refreshToken: null }),
      }),
      {
        name: "auth-storage",
        // Only store user and refresh token in persistence
        partialize: (state) => ({
          user: state.user,
          refreshToken: state.refreshToken,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.set({ isHydrated: true });
          }
        },
      }
    )
  );

export const useTokenStore = create<{
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
  }>((set) => ({
    accessToken: null,
    setAccessToken: (accessToken) => set({ accessToken }),
  }));