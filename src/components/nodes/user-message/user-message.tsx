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
import { streamText } from "ai"
import clsx from "clsx"
import { useState } from "react"
import invariant from "tiny-invariant"

import type { AdvancedModelSettings } from "~/src/providers/types"

import { GENERATION_CONFIG_KEYS, MODEL_OPTIONS } from "~/src/lib/constants"
import { buildMessages } from "~/src/lib/utils"
import {
  getGoogleModel,
  GOOGLE_MODEL_AVAILABLE_SETTINGS,
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
        miw="min(calc(100vw - 2rem), 24rem)"
        p="md"
        shadow="md"
        onSubmit={async (e) => {
          e.preventDefault()

          const formData = new FormData(
            e.currentTarget as unknown as HTMLFormElement,
          )

          const model = formData.get("model") as string

          const childId = createAssistantNode({ parentId: props.id })
          updateNodeInternals(props.id)

          if (props.parentId) {
            // Stub
          } else {
            // This means this is a root node
            const messages = buildMessages([props])

            const { textStream } = streamText({
              model: getGoogleModel(model),
              messages,
              providerOptions: {
                thinkingConfig: {
                  thinkingBudget: 0,
                },
              },
            })

            for await (const textPart of textStream) {
              updateNode({
                nodeId: childId,
                updater: (data) => ({
                  message: data.config.userPrompt + textPart,
                }),
              })
            }
          }
        }}
      >
        <Stack gap="sm">
          <Textarea
            autosize
            defaultValue={props.data.config.userPrompt}
            label="User prompt"
            maxRows={6}
            minRows={4}
            name={GENERATION_CONFIG_KEYS.USER_PROMPT}
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
