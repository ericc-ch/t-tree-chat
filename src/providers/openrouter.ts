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
    value: "qwen/qwq-32b:free",
    label: "Qwen QwQ 32B (free)",
  },
  {
    value: "qwen/qwen2.5-vl-32b-instruct:free",
    label: "Qwen 2.5 VL 32B (free)",
  },
  {
    value: "qwen/qwen-2.5-coder-32b-instruct:free",
    label: "Qwen 2.5 Coder 32B (free)",
  },
  {
    value: "deepseek/deepseek-r1:free",
    label: "DeepSeek R1 (free)",
  },
  {
    value: "deepseek/deepseek-r1-0528-qwen3-8b:free",
    label: "DeepSeek R1 0528 Qwen3 8B (free)",
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
    "qwen/qwq-32b:free",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: false,
      attachments: false,
    },
  ],
  [
    "qwen/qwen2.5-vl-32b-instruct:free",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: false,
      attachments: { image: true, pdf: false },
    },
  ],
  [
    "qwen/qwen-2.5-coder-32b-instruct:free",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: false,
      attachments: false,
    },
  ],
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
    "deepseek/deepseek-r1-0528-qwen3-8b:free",
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
    "qwen/qwq-32b:free",
    (config) => {
      return {
        model: getOpenRouterModel("qwen/qwq-32b:free"),
        system: config.systemPrompt,
        temperature: config.temperature,
      }
    },
  ],
  [
    "qwen/qwen-2.5-coder-32b-instruct:free",
    (config) => {
      return {
        model: getOpenRouterModel("qwen/qwq-32b:free"),
        system: config.systemPrompt,
        temperature: config.temperature,
      }
    },
  ],
  [
    "qwen/qwen2.5-vl-32b-instruct:free",
    (config) => {
      return {
        model: getOpenRouterModel("qwen/qwen2.5-vl-32b-instruct:free"),
        system: config.systemPrompt,
        temperature: config.temperature,
      }
    },
  ],
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
    "deepseek/deepseek-r1-0528-qwen3-8b:free",
    (config) => {
      return {
        model: getOpenRouterModel("deepseek/deepseek-r1-0528-qwen3-8b:free"),
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
