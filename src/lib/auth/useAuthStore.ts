import { create } from "zustand";

interface User {
  id: string;
  email: string | undefined;
}

interface AuthState {
  user: User | null;
  role: "admin" | "editor" | null;
  facebookToken: string | null;
  setUser: (user: User) => void;
  setRole: (role: "admin" | "editor") => void;
  setFacebookToken: (token: string) => void;
  clearFacebookToken: () => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  facebookToken: null,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setFacebookToken: (token) => set({ facebookToken: token }),
  clearFacebookToken: () => set({ facebookToken: null }),
  clearSession: () => set({ user: null, role: null, facebookToken: null }),
}));
