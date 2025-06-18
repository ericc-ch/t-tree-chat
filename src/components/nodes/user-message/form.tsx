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
import { useUpdateNodeInternals, type NodeProps } from "@xyflow/react"
import { APICallError, streamText, type CoreMessage } from "ai"
import clsx from "clsx"
import { useState, type FormEvent } from "react"
import invariant from "tiny-invariant"

import { GENERATION_CONFIG_KEY } from "~/src/lib/constants"
import { getConfig, type AttachmentsCapabilities } from "~/src/lib/generation"
import { buildMessages, buildUserMessage } from "~/src/lib/utils"
import {
  ALL_MODEL_CAPABILITIES,
  ALL_MODEL_OPTIONS_MAPPER,
  ALL_MODELS,
} from "~/src/providers/all"
import {
  useFlowStore,
  type Attachment,
  type UserMessageNode,
} from "~/src/stores/flow"

import { AdvancedConfigForm } from "./advanced-config"
import { Attachments } from "./attachments"
import classes from "./user-message.module.css"

export function Form(props: NodeProps<UserMessageNode>) {
  const updateNodeInternals = useUpdateNodeInternals()

  // const getAncestors = useFlowStore((state) => state.getAncestors)
  const createAssistantNode = useFlowStore((state) => state.createAssistantNode)
  const deleteNode = useFlowStore((state) => state.deleteNode)
  const updateNode = useFlowStore((state) => state.updateNode)
  const getAncestors = useFlowStore((state) => state.getAncestors)

  const [opened, { toggle }] = useDisclosure(false)

  const [selectedModel, setSelectedModel] = useState<string>(
    props.data.config.model,
  )

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const capabilities = ALL_MODEL_CAPABILITIES.get(selectedModel)
    invariant(
      capabilities,
      `Model capabilities not found for model ${selectedModel}`,
    )

    const formData = new FormData(event.currentTarget)

    const model = formData.get(GENERATION_CONFIG_KEY.MODEL) as string
    const message = formData.get(GENERATION_CONFIG_KEY.MESSAGE) as string
    const attachmentsString = formData.get(
      GENERATION_CONFIG_KEY.ATTACHMENTS,
    ) as string
    const attachments =
      (JSON.parse(attachmentsString) as Array<Attachment> | null) ?? []

    const config = getConfig(formData)

    updateNode({
      nodeId: props.id,
      updater: (data) => ({
        ...data,
        message,
        attachments,
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
      const ancestors = getAncestors(props.id)
      messages = buildMessages(ancestors, {
        withAttachments: Boolean(capabilities.attachments),
      })
    }

    messages.push(
      buildUserMessage(
        {
          type: "userMessage",
          data: {
            ...props.data,
            message,
            attachments,
            config: { model, ...config },
          },
        },
        {
          withAttachments: Boolean(capabilities.attachments),
        },
      ),
    )

    const mapper = ALL_MODEL_OPTIONS_MAPPER.get(model)
    invariant(mapper, `No options parser found for model ${model}`)

    try {
      const options = mapper(config)
      const response = streamText({
        ...options,
        messages,
        onError: (error: unknown) => {
          if ((error as { error?: Error }).error) {
            throw (error as { error: Error }).error
          }

          throw error as Error
        },
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
            console.log(part.textDelta)
            break
          }
          default: {
            console.log(part)
            break
          }
        }
      }
    } catch (error) {
      console.error(error)

      if (error instanceof APICallError) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const response = JSON.parse(error.responseBody ?? "{}")

        return notifications.show({
          title: error.name,
          // Im going insane
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          message: response.error.message,
          color: "red",
        })
      }

      notifications.show({
        message: (error as Error).message,
        color: "red",
      })
    }
  }

  const capabilities = ALL_MODEL_CAPABILITIES.get(selectedModel)
  invariant(
    capabilities,
    `Model capabilities not found for model ${selectedModel}`,
  )

  return (
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
        <Group gap="xs">
          <Badge color="blue">User</Badge>

          <ActionIcon
            aria-label="Delete node"
            color="red"
            ml="auto"
            title="Delete node"
            variant="outline"
            onClick={() => {
              deleteNode(props.id)
            }}
          >
            <Icon icon="mingcute:close-fill" />
          </ActionIcon>
        </Group>

        <Divider />

        <Stack gap="lg">
          <Textarea
            autosize
            defaultValue={props.data.message}
            label="User prompt"
            maxRows={6}
            minRows={4}
            name={GENERATION_CONFIG_KEY.MESSAGE}
            placeholder="Type your prompt here..."
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                event.currentTarget.form?.requestSubmit()
              }
            }}
          />

          {Boolean(capabilities.attachments) && (
            <Attachments
              capabilities={capabilities.attachments as AttachmentsCapabilities}
              defaultValues={props.data.attachments}
            />
          )}

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
          <Group gap="xs" justify="end">
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
  )
}
