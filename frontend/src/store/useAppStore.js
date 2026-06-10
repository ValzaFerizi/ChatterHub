import { create } from "zustand";

export const useAppStore = create((set) => ({
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));