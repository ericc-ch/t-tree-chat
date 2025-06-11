import { Button, MantineProvider, Paper } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import {
  Background,
  BackgroundVariant,
  Controls,
  Panel,
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
          >
            <Background gap={32} variant={BackgroundVariant.Cross} />
            <Controls />
            <Settings />
            <Panel position="bottom-center">
              <Paper withBorder p="sm">
                <Button
                  onClick={() =>
                    createRootNode(
                      {
                        model: "gpt-3.5-turbo",
                        system: "You are a helpful assistant",
                      },
                      "Hello",
                    )
                  }
                >
                  New
                </Button>
              </Paper>
            </Panel>
          </ReactFlow>
        </div>
      </ModalsProvider>
    </MantineProvider>
  )
}
