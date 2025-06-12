import { Icon } from "@iconify/react"
import {
  ActionIcon,
  Box,
  Divider,
  Group,
  NumberInput,
  Paper,
  Select,
  Slider,
  Stack,
  Text,
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

import { MODEL_OPTIONS } from "~/src/lib/constants"
import { getGoogleModel, GOOGLE_MODELS } from "~/src/providers/google"
import { useFlowStore, type UserMessageNode } from "~/src/stores/flow"

import classes from "./user-message.module.css"

// eslint-disable-next-line max-lines-per-function
export function UserMessageNode(props: NodeProps<UserMessageNode>) {
  const updateNodeInternals = useUpdateNodeInternals()

  const createAssistantNode = useFlowStore((state) => state.createAssistantNode)
  const updateNode = useFlowStore((state) => state.updateNode)

  // Child node means it's not a root node
  const isChildNode = Boolean(props.data.parentId)
  const hasChild = props.data.childrenIds.length > 0

  const [opened, { toggle }] = useDisclosure(false)

  const [temp, setTemp] = useState(0.5)

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
        onSubmit={async (e) => {
          e.preventDefault()

          const formData = new FormData(
            e.currentTarget as unknown as HTMLFormElement,
          )

          const model = formData.get("model") as string
          const prompt = formData.get("prompt") as string

          const childId = createAssistantNode(props.id)
          updateNodeInternals(props.id)

          const { textStream } = streamText({
            model: getGoogleModel(model),
            prompt,
            providerOptions: {
              thinkingConfig: {
                thinkingBudget: 0,
              },
            },
          })

          for await (const textPart of textStream) {
            updateNode(childId, (data) => ({
              message: data.message + textPart,
            }))
          }
        }}
      >
        <Stack gap="sm">
          <Textarea
            autosize
            defaultValue={props.data.message}
            label="User Prompt"
            maxRows={6}
            minRows={4}
            name="prompt"
            placeholder="Type your prompt here..."
          />

          <Group align="end" gap="xs">
            <Select
              data={MODEL_OPTIONS}
              defaultValue={GOOGLE_MODELS[0].value}
              name="model"
              placeholder="Pick a model"
            />

            <ActionIcon size="input-sm" type="submit">
              <Icon icon="mingcute:ai-fill" />
            </ActionIcon>
          </Group>

          <Divider />

          <Stack gap={0}>
            <Group gap="xs">
              <ActionIcon color="red" variant="outline">
                <Icon icon="mingcute:delete-fill" />
              </ActionIcon>
              <ActionIcon ml="auto" variant="outline">
                <Icon icon="mingcute:git-branch-fill" />
              </ActionIcon>

              <ActionIcon
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
              <Stack gap="sm" py="md">
                <Textarea
                  autosize
                  defaultValue={props.data.config.system}
                  label="System Prompt"
                  maxRows={6}
                  minRows={4}
                  name="prompt"
                  placeholder="Optional tone and style instructions for the model"
                />

                <Box>
                  <Text size="sm">Temperature</Text>
                  <Group>
                    <Slider
                      // React flow utility classes
                      // https://reactflow.dev/learn/customization/custom-nodes#nodrag
                      className="nodrag"
                      color="blue"
                      defaultValue={40}
                      marks={[
                        { value: 0.25, label: "0.25" },
                        { value: 0.5, label: "0.5" },
                        { value: 0.75, label: "0.75" },
                      ]}
                      max={1}
                      min={0}
                      name="temperature"
                      step={0.05}
                      value={temp}
                      onChange={setTemp}
                    />
                    <NumberInput
                      max={1}
                      min={0}
                      name="temperature"
                      step={0.05}
                      style={{ width: "4rem" }}
                      value={temp}
                      onChange={(value) => {
                        setTemp(Number.parseFloat(value.toString()))
                      }}
                    />
                  </Group>
                </Box>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Paper>
    </>
  )
}

export interface MessageNode {
  // Core properties
  id: string
  message: string
  role: "user" | "assistant"

  // Tree structure links
  parentId: string | null // ID of the parent node, `null` for the root
  childrenIds: Array<string> // IDs of the direct children/replies

  // Generation config
  // This config was used to generate this node's children.
  // It's most relevant on `user` nodes.
  config?: {
    model: string
    system: string
  }
}

export interface ChatState {
  // The ID of the very first message in the entire tree
  rootNodeId: string

  // A flat map of all message nodes in the chat
  nodes: {
    [nodeId: string]: MessageNode
  }

  // Optional: To easily track the user's current position
  activeNodeId: string
}
