import { Button, Paper, Textarea } from "@mantine/core"
import { Handle, Position, type Node, type NodeProps } from "@xyflow/react"
import { streamText } from "ai"

import { getGoogleModels } from "~/src/providers/google"

type ChatNodeType = Node<
  {
    user: string
    message: string
  },
  "userMessage"
>

export function NodeUserPrompt(props: NodeProps<ChatNodeType>) {
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
