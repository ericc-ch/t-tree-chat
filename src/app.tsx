import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
} from "@xyflow/react"
import { useCallback, useState } from "react"
import "@xyflow/react/dist/style.css"

import "./styles/global.css"
import { Button } from "./components/ui/button"
import { Textarea } from "./components/ui/textarea"

type ChatNodeType = Node<
  {
    user: string
    message: string
  },
  "userInput" | "message"
>

const initialNodes: Array<ChatNodeType> = [
  {
    id: "1",
    type: "userInput",
    position: { x: 0, y: 0 },
    data: { user: "User A", message: "Hey, how are you?" },
  },
  {
    id: "2",
    type: "message",
    position: { x: 250, y: 100 },
    data: { user: "User B", message: "I'm good, thanks! How about you?" },
  },
  {
    id: "3",
    type: "userInput",
    position: { x: 0, y: 200 },
    data: {
      user: "User A",
      message: "Doing great! Working on this React Flow demo.",
    },
  },
  {
    id: "4",
    type: "message",
    position: { x: 250, y: 300 },
    data: { user: "User B", message: "Oh cool! Looks good." },
  },
]
const initialEdges = [
  { id: "e1-2", source: "1", target: "2" },
  { id: "e2-3", source: "2", target: "3" },
  { id: "e3-4", source: "3", target: "4" },
]

const nodeTypes = {
  userInput: UserInputNode,
  message: MessageNode,
}

function MessageNode({ data }: NodeProps<ChatNodeType>) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="min-w-[150px] rounded-md border border-neutral-300 bg-white p-2.5 text-black">
        <strong>{data.user}</strong>
        <p className="m-0 mt-1.5 whitespace-pre-wrap">{data.message}</p>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  )
}

function UserInputNode({ data }: NodeProps<ChatNodeType>) {
  const [input, setInput] = useState("")

  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div className="min-w-[150px] rounded-md border border-neutral-300 bg-white p-2.5 text-black">
        <strong>{data.user}</strong>
        <p className="m-0 mt-1.5 whitespace-pre-wrap">{data.message}</p>
        <div className="mt-2.5">
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

export function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges],
  )

  return (
    <div className="h-screen w-screen">
      <ReactFlow
        colorMode="dark"
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
