import { Handle, Position, type Node, type NodeProps } from "@xyflow/react"
import { useState } from "react"
import "@xyflow/react/dist/style.css"

import "./styles/global.css"
import { Button } from "../ui/button"
import { Textarea } from "../ui/textarea"

type ChatNodeType = Node<
  {
    user: string
    message: string
  },
  "userMessage"
>

export function NodeUserMessage({ data }: NodeProps<ChatNodeType>) {
  const [input, setInput] = useState("")

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="bg-background border-border border border-solid p-4 rounded-lg min-w-[400x]">
        <strong>{data.user}</strong>
        <p>{data.message}</p>
        <div>
          <Textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
            }}
            rows={2}
          />
          <Button>Send</Button>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  )
}
