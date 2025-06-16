import type { GenerationConfig } from "./generation"

export const MENU_TARGET = "menuTarget"

export const GENERATION_CONFIG_KEYS = {
  MESSAGE: "message",
  MODEL: "model",
  SYSTEM_PROMPT: "systemPrompt",
  TEMPERATURE: "temperature",
  THINKING_MODE: "thinkingMode",
} satisfies Record<string, keyof GenerationConfig | "message">

export const NODE_ORIGIN: [number, number] = [0.5, 0]
