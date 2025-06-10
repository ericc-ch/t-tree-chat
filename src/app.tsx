import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
} from "@xyflow/react"

import { UserMessageNode } from "./components/nodes/user-message"
import { Settings } from "./components/panels/settings"
import { useAppStore } from "./stores/app"

// Mantine
import "@mantine/core/styles.layer.css"
// React Flow
import "@xyflow/react/dist/style.css"

// Custom
import "./styles/global.css"

const nodeTypes = {
  userMessage: UserMessageNode,
}

export function App() {
  const nodes = useAppStore((state) => state.nodes)
  const edges = useAppStore((state) => state.edges)

  const onNodesChange = useAppStore((state) => state.onNodesChange)
  const createRootNode = useAppStore((state) => state.createRootNode)

  return (
    <MantineProvider>
      <ModalsProvider>
        <div style={{ width: "100v", height: "100vh" }}>
          <ReactFlow
            edges={edges}
            nodes={nodes}
            nodeTypes={nodeTypes}
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

            <Settings />
          </ReactFlow>
        </div>
      </ModalsProvider>
    </MantineProvider>
  )
}
