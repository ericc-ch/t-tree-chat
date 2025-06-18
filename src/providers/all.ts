import type { ComboboxItemGroup } from "@mantine/core"

import type { ModelCapabilities } from "../lib/generation"
import type { OptionsMapper } from "./types"

import {
  GOOGLE_MODEL_CAPABILITIES,
  GOOGLE_MODEL_OPTIONS_MAPPER,
  GOOGLE_MODELS,
} from "./google"
import {
  OPENROUTER_MODEL_CAPABILITIES,
  OPENROUTER_MODEL_OPTIONS_MAPPER,
  OPENROUTER_MODELS,
} from "./openrouter"

export const ALL_MODELS: Array<ComboboxItemGroup> = [
  { group: "Google", items: GOOGLE_MODELS },
  { group: "OpenRouter", items: OPENROUTER_MODELS },
]

export const ALL_MODEL_CAPABILITIES = new Map<string, ModelCapabilities>([
  ...GOOGLE_MODEL_CAPABILITIES.entries(),
  ...OPENROUTER_MODEL_CAPABILITIES.entries(),
])

export const ALL_MODEL_OPTIONS_MAPPER = new Map<string, OptionsMapper>([
  ...GOOGLE_MODEL_OPTIONS_MAPPER.entries(),
  ...OPENROUTER_MODEL_OPTIONS_MAPPER.entries(),
])
