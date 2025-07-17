// useAuthStore.ts
import { create } from "zustand";

interface User {
  id: string;
  email: string | undefined;
}

interface AuthState {
  user: User | null;
  role: "admin" | "editor" | "developer" | null;
  facebookToken: string | null;
  facebookLinked: boolean;
  setUser: (user: User) => void;
  setRole: (role: "admin" | "editor" | "developer") => void;
  setFacebookToken: (token: string) => void;
  setFacebookLinked: (linked: boolean) => void;
  clearFacebookToken: () => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  role: null,
  facebookToken: null,
  facebookLinked: false,
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setFacebookToken: (token) => set({ facebookToken: token }),
  setFacebookLinked: (linked) => set({ facebookLinked: linked }),
  clearFacebookToken: () => set({ facebookToken: null }),
  clearSession: () =>
    set({ user: null, role: null, facebookToken: null, facebookLinked: false }),
}));
