import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface PreferencesState {
  theme: "light" | "dark";
  setTheme:(theme: "light" | "dark") => void;
}

export const usePreferencesStore = create<PreferencesState>()(
  persist(
    (set) => ({
      theme: "light",
      setTheme: (theme) => set({theme}),
    }),
    {
      name: "preferences-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);