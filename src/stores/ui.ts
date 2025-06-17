import { create } from "zustand"

interface UIStore {
  isContextMenuOpen: boolean
  setContextMenuOpen: (value: boolean) => void

  openContextMenu: () => void
  closeContextMenu: () => void
  toggleContextMenu: () => void

  isSyncing: boolean
  setSyncing: (value: boolean) => void
}

export const useUIStore = create<UIStore>()((set) => ({
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
  toggleContextMenu: () => {
    set((state) => ({ isContextMenuOpen: !state.isContextMenuOpen }))
  },

  isSyncing: false,
  setSyncing: (value: boolean) => {
    set({ isSyncing: value })
  },
}))
