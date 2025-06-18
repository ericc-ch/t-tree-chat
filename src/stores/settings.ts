import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SettingsState {
  googleAPIKey: string | undefined
  openRouterAPIKey: string | undefined
}

const EMPTY_SETTINGS: SettingsState = {
  googleAPIKey: undefined,
  openRouterAPIKey: undefined,
}

interface SettingsStore extends SettingsState {
  setAPIKeys: (options: SettingsState) => void
  reset: () => void
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...EMPTY_SETTINGS,

      setAPIKeys: (options: SettingsState) => {
        set({
          openRouterAPIKey: options.openRouterAPIKey,
          googleAPIKey: options.googleAPIKey,
        })
      },
      reset: () => {
        set(EMPTY_SETTINGS)
      },
    }),
    {
      name: "settings",
      partialize: (state) => ({
        openRouterAPIKey: state.openRouterAPIKey,
        googleAPIKey: state.googleAPIKey,
      }),
    },
  ),
)
