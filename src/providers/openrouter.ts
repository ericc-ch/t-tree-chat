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
  // Qwen
  {
    value: "qwen/qwq-32b:free",
    label: "Qwen QwQ 32B (free)",
  },
  {
    value: "qwen/qwen3-32b:free",
    label: "Qwen 3 32B (free)",
  },
  {
    value: "qwen/qwen-2.5-coder-32b-instruct:free",
    label: "Qwen 2.5 Coder 32B (free)",
  },
  {
    value: "qwen/qwen2.5-vl-32b-instruct:free",
    label: "Qwen 2.5 VL 32B (free)",
  },

  // DeepSeek
  {
    value: "deepseek/deepseek-r1-0528:free",
    label: "DeepSeek R1 0528 (free)",
  },
  {
    value: "deepseek/deepseek-r1:free",
    label: "DeepSeek R1 (free)",
  },
  {
    value: "deepseek/deepseek-chat-v3-0324:free",
    label: "DeepSeek V3 0324 (free)",
  },
  {
    value: "deepseek/deepseek-chat:free",
    label: "DeepSeek V3 (free)",
  },

  // Llama
  {
    value: "meta-llama/llama-4-maverick:free",
    label: "Llama 4 Maverick (free)",
  },
  {
    value: "meta-llama/llama-4-scout:free",
    label: "Llama 4 Scout (free)",
  },

  // Mistral
  {
    value: "mistralai/mistral-nemo:free",
    label: "Mistral Nemo (free)",
  },
]

export const OPENROUTER_MODEL_CAPABILITIES = new Map<
  OpenRouterModelID,
  ModelCapabilities
>([
  // Qwen
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
    "qwen/qwen3-32b:free",
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

  // DeepSeek
  [
    "deepseek/deepseek-r1-0528:free",
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
    "deepseek/deepseek-chat-v3-0324:free",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: false,
      attachments: false,
    },
  ],
  [
    "deepseek/deepseek-chat:free",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: false,
      attachments: false,
    },
  ],

  // Llama
  [
    "meta-llama/llama-4-maverick:free",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: false,
      attachments: { image: true, pdf: false },
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

  // Mistral
  [
    "mistralai/mistral-nemo:free",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: false,
      attachments: false,
    },
  ],
])

export const OPENROUTER_MODEL_OPTIONS_MAPPER: Map<
  OpenRouterModelID,
  OptionsMapper
> = new Map([
  // Qwen
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
    "qwen/qwen3-32b:free",
    (config) => {
      return {
        model: getOpenRouterModel("qwen/qwen3-32b:free"),
        system: config.systemPrompt,
        temperature: config.temperature,
      }
    },
  ],
  [
    "qwen/qwen-2.5-coder-32b-instruct:free",
    (config) => {
      return {
        model: getOpenRouterModel("qwen/qwen-2.5-coder-32b-instruct:free"),
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

  // DeepSeek
  [
    "deepseek/deepseek-r1-0528:free",
    (config) => {
      return {
        model: getOpenRouterModel("deepseek/deepseek-r1-0528:free"),
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
    "deepseek/deepseek-chat-v3-0324:free",
    (config) => {
      return {
        model: getOpenRouterModel("deepseek/deepseek-chat-v3-0324:free"),
        system: config.systemPrompt,
        temperature: config.temperature,
      }
    },
  ],
  [
    "deepseek/deepseek-chat:free",
    (config) => {
      return {
        model: getOpenRouterModel("deepseek/deepseek-chat:free"),
        system: config.systemPrompt,
        temperature: config.temperature,
      }
    },
  ],

  // Llama
  [
    "meta-llama/llama-4-maverick:free",
    (config) => {
      return {
        model: getOpenRouterModel("meta-llama/llama-4-maverick:free"),
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

  // Mistral
  [
    "mistralai/mistral-nemo:free",
    (config) => {
      return {
        model: getOpenRouterModel("mistralai/mistral-nemo:free"),
        system: config.systemPrompt,
        temperature: config.temperature,
      }
    },
  ],
])
