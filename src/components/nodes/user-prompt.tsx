import { Button, Paper, Textarea } from "@mantine/core"
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react"
import { streamText } from "ai"

import { getGoogleModels } from "~/src/providers/google"

export interface UserPrompt {
  id: string
  message: string
  role: "user"
  config: {
    model: string
    system: string
  }
  branches: Array<UserPrompt>
  [key: string]: unknown
}

type NodeUserPromptType = Node<UserPrompt, "userMessage">

export function NodeUserPrompt(props: NodeProps<NodeUserPromptType>) {
  return (
    <>
      <Handle position={Position.Top} type="target" />
      <Paper
        withBorder
        component="form"
        p="md"
        onSubmit={async (e) => {
          e.preventDefault()

          const { textStream } = streamText({
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            model: getGoogleModels().get("gemini-2.0-flash-lite")!,
            prompt: "Write a poem about embedding models.",
          })

          for await (const textPart of textStream) {
            console.log(textPart)
          }
        }}
      >
        <Textarea maxRows={6} minRows={4} name="prompt" />
        <Button type="submit">Generate</Button>
      </Paper>
      <Handle position={Position.Bottom} type="source" />
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
