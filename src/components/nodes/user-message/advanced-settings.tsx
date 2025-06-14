import type { ComponentType } from "react"

import {
  NumberInput,
  Slider,
  Space,
  Stack,
  Switch,
  Text,
  Textarea,
} from "@mantine/core"

import type { AdvancedModelSettings } from "~/src/providers/types"

import { GENERATION_CONFIG_KEYS } from "~/src/lib/constants"

interface FieldProps<T> {
  defaultValue: T
}

const SystemPrompt = ({ defaultValue }: FieldProps<string>) => (
  <Textarea
    autosize
    defaultValue={defaultValue}
    label="System prompt"
    maxRows={6}
    minRows={4}
    name={GENERATION_CONFIG_KEYS.SYSTEM_PROMPT}
    placeholder="Optional tone and style instructions for the model"
  />
)

const Temperature = ({ defaultValue }: FieldProps<number>) => (
  <>
    <Stack gap={0}>
      <Text size="sm">Temperature</Text>
      <Slider
        // React flow utility classes
        // https://reactflow.dev/learn/customization/custom-nodes#nodrag
        className="nodrag"
        color="blue"
        defaultValue={defaultValue}
        marks={[
          { value: 0.25, label: "0.25" },
          { value: 0.5, label: "0.5" },
          { value: 0.75, label: "0.75" },
        ]}
        max={1}
        min={0}
        name={GENERATION_CONFIG_KEYS.TEMPERATURE}
        step={0.05}
      />
    </Stack>
    <Space h="sm" />
  </>
)

const ThinkingMode = ({ defaultValue }: FieldProps<boolean>) => (
  <Switch
    defaultChecked={defaultValue}
    label="Thinking mode"
    name={GENERATION_CONFIG_KEYS.THINKING_MODE}
  />
)

const ThinkingBudget = ({ defaultValue }: FieldProps<number>) => (
  <NumberInput
    defaultValue={defaultValue}
    label="Thinking budget"
    max={24576}
    min={0}
    name={GENERATION_CONFIG_KEYS.THINKING_BUDGET}
  />
)

export const settingsFieldMap = new Map<
  keyof AdvancedModelSettings,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ComponentType<FieldProps<any>>
>([
  ["systemPrompt", SystemPrompt],
  ["temperature", Temperature],
  ["thinkingMode", ThinkingMode],
  ["thinkingBudget", ThinkingBudget],
])
