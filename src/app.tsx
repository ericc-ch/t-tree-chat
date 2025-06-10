import {
  ActionIcon,
  Button,
  Input,
  MantineProvider,
  Paper,
  Stack,
} from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import {
  Background,
  BackgroundVariant,
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

import { NodeUserPrompt } from "./components/nodes/user-prompt"
import { useAppStore } from "./stores/app"

// Mantine
import "@mantine/core/styles.layer.css"
// React Flow
import "@xyflow/react/dist/style.css"

// Custom
import "./styles/global.css"
import { useSettingsStore } from "./stores/settings"

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
  userInput: NodeUserPrompt,
  message: MessageNode,
}

function MessageNode({ data }: NodeProps<ChatNodeType>) {
  return (
    <>
      <Handle position={Position.Top} type="target" />
      <Paper withBorder p="md">
        <strong>{data.user}</strong>
        <p>{data.message}</p>
      </Paper>
      <Handle position={Position.Bottom} type="source" />
    </>
  )
}

// eslint-disable-next-line max-lines-per-function
export function App() {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const createRootNode = useAppStore((state) => state.createRootNode)

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      setEdges((eds) => addEdge(params, eds))
    },
    [setEdges],
  )

  const setAPIKeys = useSettingsStore((store) => store.setAPIKeys)

  return (
    <MantineProvider>
      <ModalsProvider>
        <div style={{ width: "100v", height: "100vh" }}>
          <ReactFlow
            edges={edges}
            nodes={nodes}
            nodeTypes={nodeTypes}
            onConnect={onConnect}
            onEdgesChange={onEdgesChange}
            onNodesChange={onNodesChange}
            onPaneClick={() => {
              createRootNode(
                {
                  model: "gemini-1.5-pro",
                  system: "nevermind",
                },
                "Please do something",
              )
            }}
          >
            <Background gap={32} variant={BackgroundVariant.Cross} />
            <Controls />
            <Panel position="top-left">
              <Paper withBorder p="sm">
                <ActionIcon variant="outline">⚙️</ActionIcon>
              </Paper>
            </Panel>

            <Panel position="center-left">
              <Paper withBorder h="16rem" p="sm">
                <Stack
                  component="form"
                  h="100%"
                  onSubmit={(e) => {
                    e.preventDefault()

                    const data = new FormData(
                      e.currentTarget as unknown as HTMLFormElement,
                    )
                    const openRouterAPIKey = data.get("openrouter") as string
                    const googleAPIKey = data.get("google") as string

                    console.log(openRouterAPIKey, googleAPIKey)

                    setAPIKeys({ openRouterAPIKey, googleAPIKey })
                  }}
                >
                  <Input name="openrouter" placeholder="OpenRouter API Key" />
                  <Input name="google" placeholder="Gemini API Key" />

                  <Button mt="auto" type="submit">
                    Save
                  </Button>
                </Stack>
              </Paper>
            </Panel>
          </ReactFlow>
        </div>
      </ModalsProvider>
    </MantineProvider>
  )
}

export interface MessageNode {
  id: string
  model: string
  system: string
  message: string
  role: "user" | "assistant"
  branches: Array<MessageNode>
}
