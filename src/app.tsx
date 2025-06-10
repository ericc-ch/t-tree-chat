import { Button, MantineProvider, Paper, Textarea } from "@mantine/core"
import {
  Background,
  Controls,
  Handle,
  Panel,
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
import { useCallback } from "react"
// Mantine
import "@mantine/core/styles.layer.css"
// React Flow
import "@xyflow/react/dist/style.css"

// Custom
// import "./styles/global.css"

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
      <div>
        <strong>{data.user}</strong>
        <p>{data.message}</p>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  )
}

function UserInputNode({ data }: NodeProps<ChatNodeType>) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <Paper shadow="xs" p="md">
        <Textarea minRows={4} maxRows={6} />
        <Button>Send</Button>
      </Paper>
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
    <MantineProvider>
      <div style={{ width: "100v", height: "100vh" }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        >
          <Background gap={32} />
          <Controls />
          <Panel position="top-left">tonoso</Panel>
        </ReactFlow>
      </div>
    </MantineProvider>
  )
}
