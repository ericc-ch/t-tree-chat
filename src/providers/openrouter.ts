import {
  createOpenRouter,
  type OpenRouterProvider,
} from "@openrouter/ai-sdk-provider"
import invariant from "tiny-invariant"

import type { ModelCapabilities } from "../lib/generation"
import type { OptionsMapper } from "./types"

import { useSettingsStore } from "../stores/settings"

const getOpenRouterProvider = () => {
  const apiKey = useSettingsStore.getState().openRouterAPIKey
  invariant(apiKey, "OpenRouter API key is not set")

  return createOpenRouter({
    apiKey,
  })
}

type OpenRouterProviderParams = Parameters<OpenRouterProvider>
type OpenRouterModelID = OpenRouterProviderParams[0]
type OpenRouterModelSettings = OpenRouterProviderParams[1]

export const getOpenRouterModel = (
  model: OpenRouterModelID,
  settings?: OpenRouterModelSettings,
) => {
  const provider = getOpenRouterProvider()
  return provider.chat(model, {
    ...settings,
  })
}

export const OPENROUTER_MODELS: Array<{
  value: OpenRouterModelID
  label: string
}> = [
  {
    value: "deepseek/deepseek-r1:free",
    label: "DeepSeek R1 (free)",
  },
  {
    value: "meta-llama/llama-4-scout:free",
    label: "Llama 4 Scout (free)",
  },
]

export const OPENROUTER_MODEL_CAPABILITIES = new Map<
  OpenRouterModelID,
  ModelCapabilities
>([
  [
    "deepseek/deepseek-r1:free",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: false,
      attachments: false,
    },
  ],
  [
    "meta-llama/llama-4-scout:free",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: false,
      attachments: { image: true, pdf: false },
    },
  ],
])

export const OPENROUTER_MODEL_OPTIONS_MAPPER: Map<
  OpenRouterModelID,
  OptionsMapper
> = new Map([
  [
    "deepseek/deepseek-r1:free",
    (config) => {
      return {
        model: getOpenRouterModel("deepseek/deepseek-r1:free"),
        system: config.systemPrompt,
        temperature: config.temperature,
      }
    },
  ],
  [
    "meta-llama/llama-4-scout:free",
    (config) => {
      return {
        model: getOpenRouterModel("meta-llama/llama-4-scout:free"),
        system: config.systemPrompt,
        temperature: config.temperature,
      }
    },
  ],
])
