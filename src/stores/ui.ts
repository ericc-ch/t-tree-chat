import { create } from "zustand"
import { persist } from "zustand/middleware"

interface UIStore {
  isContextMenuOpen: boolean
  setContextMenuOpen: (value: boolean) => void

  openContextMenu: () => void
  closeContextMenu: () => void

  isSyncing: boolean
  setSyncing: (value: boolean) => void

  isSidebarOpen: boolean
  setSidebarOpen: (value: boolean) => void

  openSidebar: () => void
  closeSidebar: () => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      isContextMenuOpen: false,
      setContextMenuOpen: (value: boolean) => {
        set({ isContextMenuOpen: value })
      },

      openContextMenu: () => {
        set({ isContextMenuOpen: true })
      },
      closeContextMenu: () => {
        set({ isContextMenuOpen: false })
      },

      isSyncing: false,
      setSyncing: (value: boolean) => {
        set({ isSyncing: value })
      },

      isSidebarOpen: false,
      setSidebarOpen: (value) => {
        set({ isSidebarOpen: value })
      },
      openSidebar: () => {
        set({ isSidebarOpen: true })
      },
      closeSidebar: () => {
        set({ isSidebarOpen: false })
      },
    }),
    {
      name: "ui",
      partialize: (state) => ({
        isSidebarOpen: state.isSidebarOpen,
      }),
    },
  ),
)
