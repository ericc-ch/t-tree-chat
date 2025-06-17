import { Icon } from "@iconify/react"
import {
  ActionIcon,
  Badge,
  Divider,
  Group,
  Paper,
  Select,
  Stack,
  Textarea,
} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { notifications } from "@mantine/notifications"
import {
  Handle,
  Position,
  useUpdateNodeInternals,
  type NodeProps,
} from "@xyflow/react"
import { streamText, type CoreMessage } from "ai"
import clsx from "clsx"
import { useState, type FormEvent } from "react"
import invariant from "tiny-invariant"

import { GENERATION_CONFIG_KEY } from "~/src/lib/constants"
import { getConfig } from "~/src/lib/generation"
import { buildMessages } from "~/src/lib/utils"
import { ALL_MODEL_OPTIONS_MAPPER, ALL_MODELS } from "~/src/providers/all"
import { useFlowStore, type UserMessageNode } from "~/src/stores/flow"

import { AdvancedConfigForm } from "./advanced-config"
import classes from "./user-message.module.css"

export function UserMessageNode(props: NodeProps<UserMessageNode>) {
  const updateNodeInternals = useUpdateNodeInternals()

  // const getAncestors = useFlowStore((state) => state.getAncestors)
  const createAssistantNode = useFlowStore((state) => state.createAssistantNode)
  const deleteNode = useFlowStore((state) => state.deleteNode)
  const updateNode = useFlowStore((state) => state.updateNode)
  const getAncestors = useFlowStore((state) => state.getAncestors)

  // Child node means it's not a root node
  const isChildNode = Boolean(props.data.parentId)
  const hasChild = props.data.childrenIds.length > 0

  const [opened, { toggle }] = useDisclosure(false)

  const [selectedModel, setSelectedModel] = useState<string>(
    props.data.config.model,
  )

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const message = formData.get(GENERATION_CONFIG_KEY.MESSAGE) as string
    const model = formData.get(GENERATION_CONFIG_KEY.MODEL) as string

    const config = getConfig(formData)

    updateNode({
      nodeId: props.id,
      updater: (data) => ({
        ...data,
        message,
        config: {
          model,
          ...config,
        },
      }),
    })

    const childId = createAssistantNode({ parentId: props.id })

    // Call this to notify that we updated the state of the handler
    // because bottom handler only appears after we added a child
    // https://reactflow.dev/learn/troubleshooting#couldnt-create-edge-for-sourcetarget-handle-id-some-id-edge-id-some-id
    updateNodeInternals(props.id)

    let messages: Array<CoreMessage> = []

    if (props.data.parentId) {
      // If it has a parent, we build the chat history first
      const ancestors = getAncestors(props.data.parentId)
      messages = buildMessages(ancestors)
    }

    messages.push({
      role: "user",
      content: message,
    })

    const mapper = ALL_MODEL_OPTIONS_MAPPER.get(model)
    invariant(mapper, `No options parser found for model ${model}`)

    try {
      const options = mapper(config)
      const response = streamText({
        ...options,
        messages,
      })

      for await (const part of response.fullStream) {
        switch (part.type) {
          case "text-delta": {
            updateNode({
              nodeId: childId,
              updater: (data) => ({
                ...data,
                message: data.message + part.textDelta,
              }),
            })
            break
          }
          case "reasoning": {
            // console.log(part.textDelta)
            break
          }
          default: {
            // console.log(part)
            break
          }
        }
      }
    } catch (error) {
      console.error(error)
      notifications.show({
        message: (error as Error).message,
        color: "red",
      })
    }
  }

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
        className={classes.nodeContainer}
        component="form"
        p="md"
        shadow="md"
        w="min(calc(100vw - 2rem), 24rem)"
        onSubmit={onSubmit}
      >
        <Stack gap="sm">
          <Badge color="yellow">User</Badge>

          <Divider />

          <Stack gap="sm">
            <Textarea
              autosize
              defaultValue={props.data.message}
              label="User prompt"
              maxRows={6}
              minRows={4}
              name={GENERATION_CONFIG_KEY.MESSAGE}
              placeholder="Type your prompt here..."
            />

            <div className={classes.bottomContainer}>
              <Select
                allowDeselect={false}
                data={ALL_MODELS}
                name={GENERATION_CONFIG_KEY.MODEL}
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
            </div>
          </Stack>

          <Divider />

          <Stack gap={0}>
            <Group gap="xs">
              <ActionIcon
                aria-label="Delete node"
                color="red"
                mr="auto"
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
                  className={clsx(classes.toggleAdvancedConfig, {
                    [classes.toggleAdvancedConfigOpen]: opened,
                  })}
                  icon="mingcute:arrows-down-fill"
                />
              </ActionIcon>
            </Group>

            <AdvancedConfigForm
              config={props.data.config}
              model={selectedModel}
              opened={opened}
            />
          </Stack>
        </Stack>
      </Paper>
    </>
  )
}
