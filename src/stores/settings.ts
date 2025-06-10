import { create } from "zustand"

interface SettingsState {
  openRouterAPIKey: string | undefined
  setAPIKeys: (options: SetAPIKeysOptions) => void
  setOpenRouterAPIKey: (openRouterAPIKey: string) => void
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  openRouterAPIKey: undefined,

  setAPIKeys: (options: SetAPIKeysOptions) => {
    set({ openRouterAPIKey: options.openRouterAPIKey })
  },

  setOpenRouterAPIKey: (openRouterAPIKey: string | undefined) => {
    set({ openRouterAPIKey })
  },
}))

interface SetAPIKeysOptions {
  openRouterAPIKey: string | undefined
}
