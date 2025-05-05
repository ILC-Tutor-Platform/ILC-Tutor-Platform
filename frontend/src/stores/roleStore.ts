import { create } from "zustand";
import { persist } from "zustand/middleware";

type RoleStore = {
  roles: number[];
  activeRole: number | null;
  setRoles: (roles: number[]) => void;
  setActiveRole: (role: number) => void;
  clearRoles: () => void;
  hasRole: (target: number) => boolean;
};

export const useRoleStore = create<RoleStore>()(
  persist(
    (set, get) => ({
      roles: [],
      activeRole: null,

      setRoles: (roles) => set({ roles }),
      setActiveRole: (role) => {
        const state = get();
        if (!state.roles.includes(role)) {
          console.warn("Trying to set an active role not in assigned roles.");
        }
        set({ activeRole: role });
      },
      clearRoles: () => set({ roles: [], activeRole: null }),
      hasRole: (target) => get().roles.includes(target),
    }),
    {
      name: "role-storage", // key for localStorage
      partialize: (state) => ({ activeRole: state.activeRole }), // only persist this
    },
  ),
);
