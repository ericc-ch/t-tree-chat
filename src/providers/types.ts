import type { GenerationConfig } from "../stores/flow"

export type AdvancedModelSettings = Record<
  keyof Omit<GenerationConfig, "model">,
  boolean
>
