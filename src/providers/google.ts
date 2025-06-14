import type { streamText } from "ai"
import type { FormEvent } from "react"

import {
  createGoogleGenerativeAI,
  type GoogleGenerativeAIProvider,
  type GoogleGenerativeAIProviderOptions,
} from "@ai-sdk/google"
import invariant from "tiny-invariant"

import type { AdvancedModelSettings } from "./types"

import { GENERATION_CONFIG_KEYS } from "../lib/constants"
import { useSettingsStore } from "../stores/settings"

const getGoogleProvider = () => {
  const apiKey = useSettingsStore.getState().googleAPIKey
  invariant(apiKey, "Google API key is not set")

  return createGoogleGenerativeAI({
    apiKey,
  })
}

type GetGoogleModelParams = Parameters<GoogleGenerativeAIProvider>
type GoogleModelID = GetGoogleModelParams[0] | "gemini-2.5-flash-preview-05-20"
type GoogleModelSettings = GetGoogleModelParams[1]

export const getGoogleModel = (
  model: GoogleModelID,
  settings?: GoogleModelSettings,
) => {
  const provider = getGoogleProvider()
  return provider(model, settings)
}

export const GOOGLE_MODELS: Array<{
  value: GoogleModelID
  label: string
}> = [
  {
    value: "gemini-2.5-flash-preview-05-20",
    label: "Gemini 2.5 Flash Preview 05-20",
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

export const GOOGLE_MODEL_AVAILABLE_SETTINGS = new Map<
  GoogleModelID,
  AdvancedModelSettings
>([
  [
    "gemini-2.5-flash-preview-05-20",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: true,
      thinkingBudget: true,
    },
  ],
  [
    "gemini-2.0-flash",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: false,
      thinkingBudget: false,
    },
  ],
  [
    "gemini-2.0-flash-lite",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: false,
      thinkingBudget: false,
    },
  ],
])

type StreamTextOptions = Parameters<typeof streamText>[0]
type OptionsParser = (event: FormEvent<HTMLFormElement>) => StreamTextOptions

export const GOOGLE_MODEL_OPTIONS_PARSERS: Map<GoogleModelID, OptionsParser> =
  new Map([
    [
      "gemini-2.5-flash-preview-05-20",
      (event): StreamTextOptions => {
        const formData = new FormData(event.currentTarget)

        const prompt = formData.get(
          GENERATION_CONFIG_KEYS.USER_PROMPT,
        ) as string
        const temperatureString = formData.get(
          GENERATION_CONFIG_KEYS.TEMPERATURE,
        ) as string
        const temperature = Number.parseFloat(temperatureString)

        return {
          prompt: formData.get("prompt") as string,
          system: formData.get("systemPrompt") as string,
          temperature,
          providerOptions: {
            google: {
              thinkingConfig: {
                includeThoughts,
              },
            } satisfies GoogleGenerativeAIProviderOptions,
          },
        }
      },
    ],
  ])

const tont: Parameters<typeof streamText>[0] = {}
