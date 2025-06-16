import type { ComboboxItemGroup } from "@mantine/core"

import type { GenerationConfig } from "./generation"

import { GOOGLE_MODELS } from "../providers/google"

export const MENU_TARGET = "menuTarget"

export const MODEL_OPTIONS: Array<ComboboxItemGroup> = [
  { group: "Google", items: GOOGLE_MODELS },
]

export const GENERATION_CONFIG_KEYS: Record<
  string,
  keyof GenerationConfig | "message"
> = {
  MESSAGE: "message",
  MODEL: "model",
  SYSTEM_PROMPT: "systemPrompt",
  TEMPERATURE: "temperature",
  THINKING_MODE: "thinkingMode",
}

export const NODE_ORIGIN: [number, number] = [0.5, 0]
