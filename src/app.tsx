import { Button, MantineProvider, Paper } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import {
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  ReactFlow,
  ReactFlowProvider,
  SelectionMode,
  useReactFlow,
} from "@xyflow/react"

import { ContextMenu, menuClickListener } from "./components/context-menu"

// Mantine
import "@mantine/core/styles.layer.css"
// React Flow
import "@xyflow/react/dist/style.css"

// Custom
import "./styles/global.css"
import { UserMessageNode } from "./components/nodes/user-message"
import { Settings } from "./components/panels/settings"
import { useFlowStore } from "./stores/flow"

const nodeTypes = {
  userMessage: UserMessageNode,
}

function Main() {
  const instance = useReactFlow()

  const nodes = useFlowStore((state) => state.nodes)
  const edges = useFlowStore((state) => state.edges)

  const onNodesChange = useFlowStore((state) => state.onNodesChange)
  const createRootNode = useFlowStore((state) => state.createRootNode)

  return (
    <main>
      <div style={{ width: "100v", height: "100vh" }}>
        <ReactFlow
          zoomOnDoubleClick
          edges={edges}
          nodeOrigin={[0.5, 0.5]}
          nodes={nodes}
          nodeTypes={nodeTypes}
          panOnDrag={false}
          panOnScroll={true}
          selectionMode={SelectionMode.Partial}
          onNodesChange={onNodesChange}
          onPaneClick={(event) => {
            menuClickListener({ event, instance })
          }}
        >
          <Background gap={32} variant={BackgroundVariant.Cross} />
          <Controls />
          <Settings />
          <Panel position="bottom-center">
            <Paper withBorder p="sm">
              <Button
                onClick={() => createRootNode({ position: { x: 0, y: 0 } })}
              >
                New
              </Button>
            </Paper>
          </Panel>
        </ReactFlow>
      </div>

      <ContextMenu />
    </main>
  )
}

export function App() {
  return (
    <MantineProvider>
      <ModalsProvider>
        <ReactFlowProvider>
          <Main />
        </ReactFlowProvider>
      </ModalsProvider>
    </MantineProvider>
  )
}
