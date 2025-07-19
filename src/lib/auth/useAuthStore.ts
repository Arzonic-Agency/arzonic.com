// useAuthStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

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
  setFacebookToken: (token: string | null) => void;
  setFacebookLinked: (linked: boolean) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      facebookToken: null,
      facebookLinked: false,

      setUser: (user) => set({ user }),
      setRole: (role) => set({ role }),
      setFacebookToken: (token) => set({ facebookToken: token }),
      setFacebookLinked: (linked) => set({ facebookLinked: linked }),

      clearSession: () =>
        set({
          user: null,
          role: null,
          facebookToken: null,
          facebookLinked: false,
        }),
    }),
    {
      name: "auth-storage", // key i localStorage
      // Vi vælger kun at persiste facebookToken & facebookLinked
      partialize: (state) => ({
        facebookToken: state.facebookToken,
        facebookLinked: state.facebookLinked,
      }),
    }
  )
);
