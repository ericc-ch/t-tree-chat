import type { ComponentProps, ComponentType } from "react"

import {
  Slider,
  Space,
  Stack,
  Switch,
  Text,
  Textarea,
  type SliderProps,
} from "@mantine/core"
import invariant from "tiny-invariant"

import type {
  AdvancedConfig,
  GenerationConfig,
  ModelCapabilities,
} from "~/src/lib/generation"

import { GENERATION_CONFIG_KEY } from "~/src/lib/constants"
import { ALL_MODEL_CAPABILITIES } from "~/src/providers/all"

import classes from "./user-message.module.css"

interface FieldProps<T> {
  defaultValue: T
}

const switchClassnames: ComponentProps<typeof Switch>["classNames"] = {
  body: classes.switchBody,
}

const SystemPrompt = ({ defaultValue }: FieldProps<string>) => (
  <Textarea
    autosize
    defaultValue={defaultValue}
    label="System prompt"
    maxRows={6}
    minRows={4}
    name={GENERATION_CONFIG_KEY.SYSTEM_PROMPT}
    placeholder="Optional tone and style instructions for the model"
  />
)

const Temperature = ({ defaultValue }: FieldProps<number>) => {
  const marks: SliderProps["marks"] = [
    { value: 0.25, label: "0.25" },
    { value: 0.5, label: "0.5" },
    { value: 0.75, label: "0.75" },
  ]

  return (
    <>
      <Stack gap={0}>
        <Text size="sm">Temperature</Text>
        <Slider
          // React flow utility classes
          // https://reactflow.dev/api-reference/react-flow#nodragclassname
          className="nodrag"
          color="blue"
          defaultValue={defaultValue}
          marks={marks}
          max={1}
          min={0}
          name={GENERATION_CONFIG_KEY.TEMPERATURE}
          step={0.05}
        />
      </Stack>
      <Space h="sm" />
    </>
  )
}

const ThinkingMode = ({ defaultValue }: FieldProps<boolean>) => (
  <Switch
    classNames={switchClassnames}
    defaultChecked={defaultValue}
    label="Thinking mode"
    labelPosition="left"
    name={GENERATION_CONFIG_KEY.THINKING_MODE}
    value="on"
  />
)

export const advancedConfigMap = new Map<
  keyof AdvancedConfig,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ComponentType<FieldProps<any>>
>([
  ["systemPrompt", SystemPrompt],
  ["temperature", Temperature],
  ["thinkingMode", ThinkingMode],
])

interface AdvancedConfigFormProps {
  opened: boolean
  model: string
  config: GenerationConfig
}

export const AdvancedConfigForm = (props: AdvancedConfigFormProps) => {
  const capabilities = ALL_MODEL_CAPABILITIES.get(props.model)
  invariant(
    capabilities,
    `Model capabilities not found for model ${props.model}`,
  )

  const capabilityKeys = Object.entries(capabilities)
    .filter(([, value]) => value)
    .map(([key]) => key as keyof ModelCapabilities)

  return (
    <Stack display={props.opened ? "flex" : "none"} gap="sm" pt="md">
      {capabilityKeys.map((key: keyof ModelCapabilities) => {
        const Field = advancedConfigMap.get(key)
        if (!Field) {
          console.warn(`No setting field found for ${key}`)
          return undefined
        }

        return <Field key={key} defaultValue={props.config[key]} />
      })}
    </Stack>
  )
}
