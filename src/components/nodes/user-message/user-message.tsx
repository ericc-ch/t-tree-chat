import { Icon } from "@iconify/react"
import {
  ActionIcon,
  Box,
  Divider,
  Group,
  Paper,
  Select,
  Stack,
  Textarea,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import {
  Handle,
  Position,
  useUpdateNodeInternals,
  type NodeProps,
} from "@xyflow/react"
import { streamText, type CoreMessage } from "ai"
import clsx from "clsx"
import { useState } from "react"
import invariant from "tiny-invariant"

import type { AdvancedModelSettings } from "~/src/providers/types"

import { GENERATION_CONFIG_KEYS, MODEL_OPTIONS } from "~/src/lib/constants"
import {
  GOOGLE_MODEL_AVAILABLE_SETTINGS,
  GOOGLE_MODEL_OPTIONS_PARSERS,
} from "~/src/providers/google"
import { useFlowStore, type UserMessageNode } from "~/src/stores/flow"

import { settingsFieldMap } from "./advanced-settings"
import classes from "./user-message.module.css"

// eslint-disable-next-line max-lines-per-function
export function UserMessageNode(props: NodeProps<UserMessageNode>) {
  const updateNodeInternals = useUpdateNodeInternals()

  // const getAncestors = useFlowStore((state) => state.getAncestors)
  const createAssistantNode = useFlowStore((state) => state.createAssistantNode)
  const deleteNode = useFlowStore((state) => state.deleteNode)
  const updateNode = useFlowStore((state) => state.updateNode)

  // Child node means it's not a root node
  const isChildNode = Boolean(props.data.parentId)
  const hasChild = props.data.childrenIds.length > 0

  const [opened, { toggle }] = useDisclosure(false)

  const [selectedModel, setSelectedModel] = useState<string>(
    props.data.config.model,
  )

  const availableSettings = GOOGLE_MODEL_AVAILABLE_SETTINGS.get(selectedModel)
  invariant(availableSettings, `Not settings found for model ${selectedModel}`)
  const availableSettingsKeys = Object.entries(availableSettings)
    .filter(([, value]) => value)
    .map(([key]) => key)

  return (
    <>
      {isChildNode && (
        <Handle isConnectable={false} position={Position.Top} type="target" />
      )}
      {hasChild && (
        <Handle
          isConnectable={false}
          position={Position.Bottom}
          type="source"
        />
      )}

      <Paper
        withBorder
        component="form"
        p="md"
        shadow="md"
        w="min(calc(100vw - 2rem), 24rem)"
        // eslint-disable-next-line max-lines-per-function
        onSubmit={async (event) => {
          event.preventDefault()

          const formData = new FormData(
            event.currentTarget as unknown as HTMLFormElement,
          )

          console.log(formData)

          const message = formData.get(GENERATION_CONFIG_KEYS.MESSAGE) as string

          const model = formData.get("model") as string
          const systemPrompt = formData.get(
            GENERATION_CONFIG_KEYS.SYSTEM_PROMPT,
          ) as string
          const temperature = Number.parseFloat(
            formData.get(GENERATION_CONFIG_KEYS.TEMPERATURE) as string,
          )
          const thinkingMode =
            formData.get(GENERATION_CONFIG_KEYS.THINKING_MODE) === "on"
          const manualThinkingBudget = Boolean(
            formData.get(GENERATION_CONFIG_KEYS.MANUAL_THINKING_BUDGET),
          )
          const thinkingBudget = Number.parseInt(
            formData.get(GENERATION_CONFIG_KEYS.THINKING_BUDGET) as string,
            10,
          )

          updateNode({
            nodeId: props.id,
            updater: (data) => ({
              ...data,
              message,
              config: {
                model,
                systemPrompt,
                temperature,
                thinkingMode,
                manualThinkingBudget,
                thinkingBudget,
              },
            }),
          })

          const childId = createAssistantNode({ parentId: props.id })

          // Call this to notify that we updated the state of the handler
          // because bottom handler only appears after we added a child
          // https://reactflow.dev/learn/troubleshooting#couldnt-create-edge-for-sourcetarget-handle-id-some-id-edge-id-some-id
          updateNodeInternals(props.id)

          if (props.parentId) {
            // Stub
          } else {
            // This means this is a root node
            const messages: Array<CoreMessage> = [
              {
                role: "user",
                content: formData.get(GENERATION_CONFIG_KEYS.MESSAGE) as string,
              },
            ]
            const parser = GOOGLE_MODEL_OPTIONS_PARSERS.get(model)
            invariant(parser, `No options parser found for model ${model}`)

            const options = parser(event)

            const { textStream } = streamText({
              messages,
              ...options,
            })

            for await (const textPart of textStream) {
              console.log(textPart)
              updateNode({
                nodeId: childId,
                updater: (data) => ({
                  ...data,
                  message: data.message + textPart,
                }),
              })
            }
          }
        }}
      >
        <Stack gap="sm">
          <Textarea
            autosize
            defaultValue={props.data.message}
            label="User prompt"
            maxRows={6}
            minRows={4}
            name={GENERATION_CONFIG_KEYS.MESSAGE}
            placeholder="Type your prompt here..."
          />

          <Box
            display="grid"
            style={{
              gridTemplateColumns: "1fr auto",
              alignItems: "center",
              gap: "var(--mantine-spacing-xs)",
            }}
          >
            <Select
              allowDeselect={false}
              data={MODEL_OPTIONS}
              name={GENERATION_CONFIG_KEYS.MODEL}
              placeholder="Pick a model"
              value={selectedModel}
              onChange={(value) => {
                invariant(value, "Model should not be null")
                setSelectedModel(value)
              }}
            />

            <ActionIcon
              aria-label="Generate response"
              size="input-sm"
              title="Generate response"
              type="submit"
            >
              <Icon icon="mingcute:ai-fill" />
            </ActionIcon>
          </Box>

          <Divider />

          <Stack gap={0}>
            <Group gap="xs">
              <ActionIcon
                aria-label="Delete node"
                color="red"
                title="Delete node"
                variant="outline"
                onClick={() => {
                  deleteNode(props.id)
                }}
              >
                <Icon icon="mingcute:delete-fill" />
              </ActionIcon>
              <ActionIcon
                aria-label="Duplicate node"
                ml="auto"
                title="Duplicate node"
                variant="outline"
              >
                <Icon icon="mingcute:git-branch-fill" />
              </ActionIcon>

              <ActionIcon
                aria-label="More options"
                title="More options"
                variant={opened ? "filled" : "outline"}
                onClick={toggle}
              >
                <Icon
                  className={clsx(classes.moreOptionsButton, {
                    [classes.moreOptionsButtonActive]: opened,
                  })}
                  icon="mingcute:arrows-down-fill"
                />
              </ActionIcon>
            </Group>

            {opened && (
              <Stack gap="sm" pt="md">
                {availableSettingsKeys.map((key) => {
                  const Field = settingsFieldMap.get(
                    key as keyof AdvancedModelSettings,
                  )
                  invariant(Field, `No setting field found for ${key}`)

                  return (
                    <Field
                      key={key}
                      defaultValue={
                        props.data.config[key as keyof AdvancedModelSettings]
                      }
                    />
                  )
                })}
              </Stack>
            )}
          </Stack>
        </Stack>
      </Paper>
    </>
  )
}
