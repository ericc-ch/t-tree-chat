import { createGoogleGenerativeAI } from "@ai-sdk/google"

import { useSettingsStore } from "../stores/settings"

const getGoogleProvider = () => {
  const apiKey = useSettingsStore.getState().googleAPIKey

  if (!apiKey) {
    throw new Error("Google API key is not set")
  }

  return createGoogleGenerativeAI({
    apiKey,
  })
}

export const getGoogleModels = () => {
  const provider = getGoogleProvider()

  return new Map([
    ["gemini-2.0-flash-lite", provider("gemini-2.0-flash-lite")],
  ] as const)
}
