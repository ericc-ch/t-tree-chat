import {
  Background,
  Controls,
  Handle,
  Position,
  ReactFlow,
  type Node,
  type NodeProps,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"

import "./styles/global.css"

type ChatNodeType = Node<
  {
    user: string
    message: string
  },
  "chat"
>

const initialNodes: Array<Node> = [
  {
    id: "1",
    type: "chat",
    position: { x: 0, y: 0 },
    data: { user: "User A", message: "Hey, how are you?" },
  },
  {
    id: "2",
    type: "chat",
    position: { x: 250, y: 100 },
    data: { user: "User B", message: "I'm good, thanks! How about you?" },
  },
  {
    id: "3",
    type: "chat",
    position: { x: 0, y: 200 },
    data: {
      user: "User A",
      message: "Doing great! Working on this React Flow demo.",
    },
  },
  {
    id: "4",
    type: "chat",
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
  chat: ChatNode,
}

function ChatNode({ data }: NodeProps<ChatNodeType>) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div
        style={{
          padding: 10,
          border: "1px solid #ddd",
          borderRadius: 5,
          background: "white",
          color: "black",
          minWidth: 150,
        }}
      >
        <strong>{data.user}</strong>
        <p style={{ margin: 0, marginTop: 5, whiteSpace: "pre-wrap" }}>
          {data.message}
        </p>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  )
}

export function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <ReactFlow
        colorMode="dark"
        defaultNodes={initialNodes}
        defaultEdges={initialEdges}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
