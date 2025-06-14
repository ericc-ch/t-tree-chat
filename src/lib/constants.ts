import type { ComboboxItemGroup } from "@mantine/core"

import { GOOGLE_MODELS } from "../providers/google"

export const MENU_TARGET = "menuTarget"

export const MODEL_OPTIONS: Array<ComboboxItemGroup> = [
  { group: "Google", items: GOOGLE_MODELS },
]

export const GENERATION_CONFIG_KEYS = {
  USER_PROMPT: "userPrompt",
  MODEL: "model",
  SYSTEM_PROMPT: "systemPrompt",
  TEMPERATURE: "temperature",
  THINKING_MODE: "thinkingMode",
  THINKING_BUDGET: "thinkingBudget",
}
