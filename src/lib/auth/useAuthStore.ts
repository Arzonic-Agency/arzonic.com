import { create } from "zustand";

interface User {
  id: string;
  email: string | undefined;
}

interface AuthState {
  user: User | null;
  role: "admin" | "editor" | null;
  setUser: (user: User) => void;
  setRole: (role: "admin" | "editor") => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  clearSession: () => set({ user: null, role: null }),
}));
