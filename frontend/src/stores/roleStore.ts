import { create } from "zustand";

type RoleStore = {
  roles: number[];
  setRoles: (roles: number[]) => void;
  clearRoles: () => void;
  hasRole: (target: number) => boolean;
};

export const useRoleStore = create<RoleStore>((set, get) => ({
  roles: [],
  setRoles: (roles) => set({ roles }),
  clearRoles: () => set({ roles: [] }),
  hasRole: (target) => get().roles.includes(target),
}));
