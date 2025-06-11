import { create } from "zustand"

interface UIStore {
  isContextMenuOpen: boolean
  closeContextMenu: () => void
  toggleContextMenu: () => void
}

export const useUIStore = create<UIStore>()((set) => ({
  isContextMenuOpen: false,
  closeContextMenu: () => {
    set({ isContextMenuOpen: false })
  },
  toggleContextMenu: () => {
    set((state) => ({ isContextMenuOpen: !state.isContextMenuOpen }))
  },
}))
