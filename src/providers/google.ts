import {
  createGoogleGenerativeAI,
  type GoogleGenerativeAIProvider,
} from "@ai-sdk/google"
import invariant from "tiny-invariant"

import { useSettingsStore } from "../stores/settings"

const getGoogleProvider = () => {
  const apiKey = useSettingsStore.getState().googleAPIKey
  invariant(apiKey, "Google API key is not set")

  return createGoogleGenerativeAI({
    apiKey,
  })
}

type GetGoogleModelParams = Parameters<GoogleGenerativeAIProvider>
type ModelID = GetGoogleModelParams[0]
type ModelSettings = GetGoogleModelParams[1]

export const getGoogleModel = (model: ModelID, settings?: ModelSettings) => {
  const provider = getGoogleProvider()
  return provider(model, settings)
}
