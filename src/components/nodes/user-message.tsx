import { Button, Paper, Select, Textarea } from "@mantine/core"
import {
  Handle,
  Position,
  useUpdateNodeInternals,
  type NodeProps,
} from "@xyflow/react"
import { streamText } from "ai"

import { getGoogleModel } from "~/src/providers/google"
import { useAppStore, type UserMessageNode } from "~/src/stores/app"

// eslint-disable-next-line max-lines-per-function
export function UserMessageNode(props: NodeProps<UserMessageNode>) {
  const updateNodeInternals = useUpdateNodeInternals()

  const createAssistantNode = useAppStore((state) => state.createAssistantNode)
  const updateNode = useAppStore((state) => state.updateNode)

  // Child node means it's not a root node
  const isChildNode = Boolean(props.data.parentId)
  const hasChild = props.data.childrenIds.length > 0

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
        <Textarea
          defaultValue={props.data.message}
          maxRows={6}
          minRows={4}
          name="prompt"
        />

        <Select
          data={[
            {
              group: "Google",
              items: ["gemini-2.0-flash-lite", "gemini-2.0-flash"],
            },
            { group: "OpenRouter", items: ["Express", "Django"] },
          ]}
          label="Your favorite library"
          name="model"
          placeholder="Pick value"
        />

        <Button type="submit">Generate</Button>
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
