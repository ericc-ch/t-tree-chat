import { create } from "zustand"

interface UIStore {
  isContextMenuOpen: boolean
  setContextMenuOpen: (value: boolean) => void

  openContextMenu: () => void
  closeContextMenu: () => void
  toggleContextMenu: () => void
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
}))
