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
  facebookPageAccess: boolean;
  facebookPageName?: string;
  facebookValidating: boolean;
  setUser: (user: User) => void;
  setRole: (role: "admin" | "editor" | "developer") => void;
  setFacebookToken: (token: string | null) => void;
  setFacebookLinked: (linked: boolean) => void;
  setFacebookPageAccess: (hasAccess: boolean, pageName?: string) => void;
  setFacebookPageName: (name?: string) => void;
  setFacebookValidating: (validating: boolean) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      facebookToken: null,
      facebookLinked: false,
      facebookPageAccess: false,
      facebookPageName: undefined,
      facebookValidating: false,

      setUser: (user) => set({ user }),
      setRole: (role) => set({ role }),
      setFacebookToken: (token) => set({ facebookToken: token }),
      setFacebookLinked: (linked) => set({ facebookLinked: linked }),
      setFacebookPageAccess: (hasAccess, pageName) =>
        set({
          facebookPageAccess: hasAccess,
          facebookPageName: pageName,
          facebookValidating: false,
        }),
      setFacebookPageName: (name) => set({ facebookPageName: name }),
      setFacebookValidating: (validating) =>
        set({ facebookValidating: validating }),

      clearSession: () =>
        set({
          user: null,
          role: null,
          facebookToken: null,
          facebookLinked: false,
          facebookPageAccess: false,
          facebookPageName: undefined,
          facebookValidating: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        facebookToken: state.facebookToken,
        facebookLinked: state.facebookLinked,
      }),
    }
  )
);
