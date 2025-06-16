import type { streamText } from "ai"

import type { AdvancedConfig } from "../lib/generation"

type StreamTextOptions = Parameters<typeof streamText>[0]
export type OptionsMapper = (config: AdvancedConfig) => StreamTextOptions
