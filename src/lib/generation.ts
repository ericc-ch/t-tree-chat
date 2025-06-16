import { GOOGLE_MODELS } from "../providers/google"
import { GENERATION_CONFIG_KEYS } from "./constants"

export interface AdvancedConfig {
  systemPrompt: string
  temperature: number
  thinkingMode: boolean
}

export interface GenerationConfig extends AdvancedConfig {
  model: string
}

export type ModelCapabilities = Record<keyof AdvancedConfig, boolean>

export const DEFAULT_GENERATION_CONFIG: GenerationConfig = {
  model: GOOGLE_MODELS[0].value,
  systemPrompt: "",
  temperature: 1,
  thinkingMode: false,
}

export function getConfig(formData: FormData): AdvancedConfig {
  const systemPrompt = formData.get(GENERATION_CONFIG_KEYS.SYSTEM_PROMPT) as
    | string
    | null

  const temperatureString = formData.get(GENERATION_CONFIG_KEYS.TEMPERATURE) as
    | string
    | null
  const temperature = Number.parseFloat(
    temperatureString ?? DEFAULT_GENERATION_CONFIG.temperature.toString(),
  )

  const thinkingMode =
    formData.get(GENERATION_CONFIG_KEYS.THINKING_MODE) === "on"

  return {
    systemPrompt: systemPrompt ?? DEFAULT_GENERATION_CONFIG.systemPrompt,
    temperature,
    thinkingMode,
  }
}
