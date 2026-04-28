"use client";

import { create } from "zustand";
import type { SessionUser, Workspace } from "@/types";

interface AppState {
  user: SessionUser | null;
  activeWorkspace: Workspace | null;
  sidebarOpen: boolean;

  setUser: (user: SessionUser | null) => void;
  setActiveWorkspace: (workspace: Workspace | null) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  activeWorkspace: null,
  sidebarOpen: true,

  setUser: (user) => set({ user }),
  setActiveWorkspace: (activeWorkspace) => set({ activeWorkspace }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
}));
