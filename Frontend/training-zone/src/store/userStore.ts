import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SafeUser } from "../models/user";

interface UserState {
  currentUser: SafeUser | null;
  setCurrentUser: (user: SafeUser) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      currentUser: null,
      setCurrentUser: (user) => set({ currentUser: user }),
      clearUser: () => set({ currentUser: null }),
    }),
    {
      name: "user-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
);
