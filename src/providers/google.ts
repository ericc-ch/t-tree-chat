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
      manualThinkingBudget: false,
      thinkingBudget: false,
    },
  ],
  [
    "gemini-2.0-flash",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: false,
      manualThinkingBudget: false,
      thinkingBudget: false,
    },
  ],
  [
    "gemini-2.0-flash-lite",
    {
      systemPrompt: true,
      temperature: true,
      thinkingMode: false,
      manualThinkingBudget: false,
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

        const temperatureString = formData.get(
          GENERATION_CONFIG_KEYS.TEMPERATURE,
        ) as string
        const temperature = Number.parseFloat(temperatureString)
        const system = formData.get(
          GENERATION_CONFIG_KEYS.SYSTEM_PROMPT,
        ) as string
        const thinkingMode = Boolean(
          formData.get(GENERATION_CONFIG_KEYS.THINKING_MODE),
        )
        // const thinkingBudget = Number.parseInt(
        //   formData.get(GENERATION_CONFIG_KEYS.THINKING_BUDGET) as string,
        //   10,
        // )
        // const manualThinkingBudget = Boolean(
        //   formData.get(GENERATION_CONFIG_KEYS.MANUAL_THINKING_BUDGET),
        // )

        return {
          model: getGoogleModel("gemini-2.5-flash-preview-05-20"),
          system,
          temperature,
          providerOptions: {
            google: {
              thinkingConfig: {
                // TODO: Implement thinking budget
                // 0 disables thinking mode btw
                // https://ai-sdk.dev/providers/ai-sdk-providers/google-generative-ai#language-models

                // includeThoughts: thinkingBudget > 0,
                // thinkingBudget: manualThinkingBudget ? thinkingBudget : null,
                includeThoughts: thinkingMode,
                thinkingBudget: thinkingMode ? null : 0,
              },
            } satisfies GoogleGenerativeAIProviderOptions,
          },
        }
      },
    ],
  ])
