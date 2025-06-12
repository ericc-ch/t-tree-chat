import { Icon } from "@iconify/react"
import {
  ActionIcon,
  Collapse,
  Divider,
  Group,
  Paper,
  Select,
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

import { GOOGLE_MODELS } from "~/src/lib/constants"
import { getGoogleModel } from "~/src/providers/google"
import { useFlowStore, type UserMessageNode } from "~/src/stores/flow"

// eslint-disable-next-line max-lines-per-function
export function UserMessageNode(props: NodeProps<UserMessageNode>) {
  const updateNodeInternals = useUpdateNodeInternals()

  const createAssistantNode = useFlowStore((state) => state.createAssistantNode)
  const updateNode = useFlowStore((state) => state.updateNode)

  // Child node means it's not a root node
  const isChildNode = Boolean(props.data.parentId)
  const hasChild = props.data.childrenIds.length > 0

  const [opened, { toggle }] = useDisclosure(false)

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
            defaultValue={props.data.message}
            maxRows={6}
            minRows={4}
            name="prompt"
          />

          <Group align="end" gap="xs">
            <Select
              data={[
                {
                  group: "Google",
                  items: GOOGLE_MODELS,
                },
                { group: "OpenRouter", items: ["Express", "Django"] },
              ]}
              name="model"
              placeholder="Pick a model"
            />

            <ActionIcon size="input-sm" type="submit">
              <Icon icon="mingcute:ai-fill" />
            </ActionIcon>
          </Group>

          <Divider my="sm" />

          <Group gap="xs">
            <ActionIcon color="red" variant="outline">
              <Icon icon="mingcute:delete-fill" />
            </ActionIcon>
            <ActionIcon ml="auto" variant="outline">
              <Icon icon="mingcute:git-branch-fill" />
            </ActionIcon>

            <ActionIcon variant="outline" onClick={toggle}>
              <Icon icon="mingcute:arrows-down-fill" />
            </ActionIcon>
          </Group>

          <Collapse in={opened}>
            <Text>WOWZO ANJAY</Text>
          </Collapse>
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
