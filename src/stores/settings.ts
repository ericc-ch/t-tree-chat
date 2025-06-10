import { create } from "zustand"

interface SettingsState {
  googleAPIKey: string | undefined
  openRouterAPIKey: string | undefined
}

interface SettingsStore extends SettingsState {
  setAPIKeys: (options: SettingsState) => void
}

export const useSettingsStore = create<SettingsStore>()((set) => ({
  googleAPIKey: undefined,
  openRouterAPIKey: undefined,

  setAPIKeys: (options: SettingsState) => {
    set({
      openRouterAPIKey: options.openRouterAPIKey,
      googleAPIKey: options.googleAPIKey,
    })
  },
}))
