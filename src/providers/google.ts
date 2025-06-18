import {
  createGoogleGenerativeAI,
  type GoogleGenerativeAIProvider,
  type GoogleGenerativeAIProviderOptions,
} from "@ai-sdk/google"
import invariant from "tiny-invariant"

import type { ModelCapabilities } from "../lib/generation"
import type { OptionsMapper } from "./types"

import { useSettingsStore } from "../stores/settings"

const getGoogleProvider = () => {
  const apiKey = useSettingsStore.getState().googleAPIKey
  invariant(apiKey, "Google API key is not set")

  return createGoogleGenerativeAI({
    apiKey,
  })
}

type GoogleProviderParams = Parameters<GoogleGenerativeAIProvider>
type GoogleModelID = GoogleProviderParams[0]
type GoogleModelSettings = GoogleProviderParams[1]

export const getGoogleModel = (
  model: GoogleModelID,
  settings?: GoogleModelSettings,
) => {
  const provider = getGoogleProvider()
  return provider(model, {
    safetySettings: [
      { category: "HARM_CATEGORY_CIVIC_INTEGRITY", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
      { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
    ],
    ...settings,
  })
}

export const GOOGLE_MODELS: Array<{
  value: GoogleModelID
  label: string
}> = [
  {
    value: "gemini-2.5-pro",
    label: "Gemini 2.5 Pro",
  },
  {
    value: "gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
  },
  {
    value: "gemini-2.5-flash-lite-preview-06-17",
    label: "Gemini 2.5 Flash Lite (Preview)",
  },
  {
    value: "gemini-2.0-flash",
    label: "Gemini 2.0 Flash",
  },
  {
    value: "gemini-2.0-flash-lite",
    label: "Gemini 2.0 Flash Lite",
  },
]

export const GOOGLE_MODEL_CAPABILITIES = new Map<
  GoogleModelID,
  ModelCapabilities
>([
  [
    "gemini-2.5-pro",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: true,
      attachments: { image: true, pdf: true },
    },
  ],
  [
    "gemini-2.5-flash",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: true,
      attachments: { image: true, pdf: true },
    },
  ],
  [
    "gemini-2.5-flash-lite-preview-06-17",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: true,
      attachments: { image: true, pdf: true },
    },
  ],
  [
    "gemini-2.0-flash",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: false,
      attachments: { image: true, pdf: true },
    },
  ],
  [
    "gemini-2.0-flash-lite",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: false,
      attachments: { image: true, pdf: true },
    },
  ],
])

export const GOOGLE_MODEL_OPTIONS_MAPPER: Map<GoogleModelID, OptionsMapper> =
  new Map([
    [
      "gemini-2.5-pro",
      (config) => {
        return {
          model: getGoogleModel("gemini-2.5-pro"),
          system: config.systemPrompt,
          temperature: config.temperature,
          providerOptions: {
            google: {
              thinkingConfig: {
                // TODO: Implement thinking budget
                // 0 disables thinking mode btw
                // https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai#language-models
                includeThoughts: config.thinkingMode,
                thinkingBudget: config.thinkingMode ? null : 0,
              },
            } satisfies GoogleGenerativeAIProviderOptions,
          },
        }
      },
    ],
    [
      "gemini-2.5-flash",
      (config) => {
        return {
          model: getGoogleModel("gemini-2.5-flash"),
          system: config.systemPrompt,
          temperature: config.temperature,
          providerOptions: {
            google: {
              thinkingConfig: {
                // TODO: Implement thinking budget
                // 0 disables thinking mode btw
                // https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai#language-models
                includeThoughts: config.thinkingMode,
                thinkingBudget: config.thinkingMode ? null : 0,
              },
            } satisfies GoogleGenerativeAIProviderOptions,
          },
        }
      },
    ],
    [
      "gemini-2.5-flash-lite-preview-06-17",
      (config) => {
        return {
          model: getGoogleModel("gemini-2.5-flash-lite-preview-06-17"),
          system: config.systemPrompt,
          temperature: config.temperature,
          providerOptions: {
            google: {
              thinkingConfig: {
                // TODO: Implement thinking budget
                // 0 disables thinking mode btw
                // https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai#language-models
                includeThoughts: config.thinkingMode,
                thinkingBudget: config.thinkingMode ? null : 0,
              },
            } satisfies GoogleGenerativeAIProviderOptions,
          },
        }
      },
    ],
    [
      "gemini-2.0-flash",
      (config) => {
        return {
          model: getGoogleModel("gemini-2.0-flash"),
          system: config.systemPrompt,
          temperature: config.temperature,
        }
      },
    ],
    [
      "gemini-2.0-flash-lite",
      (config) => {
        return {
          model: getGoogleModel("gemini-2.0-flash-lite"),
          system: config.systemPrompt,
          temperature: config.temperature,
        }
      },
    ],
  ])
